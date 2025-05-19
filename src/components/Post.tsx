import { useState } from "react";
import LikeButton from "./LikeButton";
import { PostType } from "./Posts";
import CommentSection from "./CommentSection";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import DeleteConfirmation from "./DeleteConfirmation";
import { useAuth } from "../context/AuthContext";

interface Props {
    post: PostType;
    setDisplayImage: React.Dispatch<React.SetStateAction<string | null>>;
};

export const calculateTime = (created_at: string) => {
    const now = new Date();
    const createdDate = new Date(created_at);
    const seconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if(seconds < 60) return `${seconds} seconds ago`;
    if(minutes < 60) return `${minutes} minutes ago`;
    if(hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
}

const getCommentCount = async(post_id: number) => {
    const { error, count } = await supabase.from("comments").select("*", {count: 'exact'}).eq("post_id", post_id);

    if(error) throw new Error(error.message);

    return count as number;
}

const deletePost = async(post_id: number) => {
    const { error } = await supabase.from("posts").delete().eq("id", post_id);

    if(error) throw new Error(error.message);
}

export default function Post({ post, setDisplayImage }: Props) {
    const [showComments, setShowComments] = useState<boolean>(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);

    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: comment_count } = useQuery<number, Error>({
        queryKey: ["comment_count", post.id, true],
        queryFn: () => getCommentCount(post.id),
        refetchInterval: 5000
    });

    const { mutate, isPending, isError } = useMutation({
        mutationFn: (post_id: number) => {
            return deletePost(post_id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["posts"]});
        }
    });

    const handleDelete = () => {
        setShowDeleteConfirmation(true);
    }

    const handleCancel = () => {
        setShowDeleteConfirmation(false);
    }

    const handleDeleteConfirm = () => {
        setShowDeleteConfirmation(false);
        mutate(post.id);
    }

    const is_creator = () => {
        return user?.id === post.user_id;
    }

    if(isPending) return <div>Loading...</div>

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 w-[80%]">
            <div className="flex items-center mb-2">
                <div className="w-10 h-10 mr-3 rounded-full overflow-hidden">
                <img src={post.avatar_url} alt={`User avatar`} className="w-full h-full object-cover" />
                </div>
                <div>
                <p className="font-semibold text-sm">{post.email}</p>
                <p className="text-gray-500 text-xs">{calculateTime(post.created_at)}</p>
                </div>
                {user && is_creator() &&
                    <span className="ml-auto cursor-pointer" onClick={handleDelete}>🗑️</span>
                }
            </div>

            {showDeleteConfirmation && 
                <DeleteConfirmation
                    isOpen={showDeleteConfirmation}
                    onCancel={handleCancel}
                    onConfirm={handleDeleteConfirm}
                />
            }

            <div className="mb-4">
                <p className="text-base">{post.content}</p>
                {post.image_url && (
                    <img 
                        src={post.image_url} 
                        alt="Post image" 
                        className="w-full mt-4 rounded-lg object-cover h-60 max-w-full cursor-pointer" 
                        onClick={() => setDisplayImage(post.image_url!)}
                    />
                )}
            </div>

            <div className="flex justify-between text-sm text-gray-600">
                <LikeButton post_id={post.id} is_post={true}/>
                <div className="flex items-center">
                <span className="mr-1 cursor-pointer" onClick={() => setShowComments((prev) => !prev)}>💬</span>
                <span>{comment_count}</span>
                </div>
            </div>
            {showComments && <>
                <hr className="my-5 text-gray-500"/>
                <CommentSection post_id={post.id}/>
            </>}

            {isError && <p className="text-red-500 italic mt-5">Failed to delete post</p>}
        </div>
    );
}