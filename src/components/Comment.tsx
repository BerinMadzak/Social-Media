import { useState } from "react";
import { CommentType } from "./CommentSection"
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import LikeButton from "./LikeButton";
import DeleteConfirmation from "./DeleteConfirmation";
import TimeDisplay from "./TimeDisplay";
import usePoster from "../hooks/usePoster";
import { useNavigate } from "react-router-dom";

interface Props {
    comment: CommentType & {
        children?: CommentType[];
    };
    post_id: number;
}

const createReply = async(content: string, post_id: number, parent_comment_id: number, user_id?: string) => {
    if(!user_id) {
        throw new Error("You must be logged in to reply");
    }

    const { error } = await supabase.from("comments").insert({
        post_id: post_id,
        content: content,
        parent_comment_id: parent_comment_id,
        user_id: user_id,
    });

    if(error) throw new Error(error.message);
}

const getCommentCount = async(comment_id: number) => {
    const { error, count } = await supabase.from("comments").select("*", {count: 'exact'}).eq("parent_comment_id", comment_id);

    if(error) throw new Error(error.message);

    return count as number;
}

const deleteComment = async(comment_id: number) => {
    const { error } = await supabase.from("comments").delete().eq("id", comment_id);

    if(error) throw new Error(error.message);
}

export default function Comment({ comment, post_id }: Props) {
    const [showReply, setShowReply] = useState<boolean>(false);
    const [content, setContent] = useState<string>("");
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);

    const { user } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    const { data: poster } = usePoster(comment.user_id);

    const { data: comment_count } = useQuery<number, Error>({
        queryKey: ["comment_count", comment.id, false],
        queryFn: () => getCommentCount(comment.id),
        refetchInterval: 5000
    });
    
    const { mutate, isPending, isError } = useMutation({
        mutationFn: (content: string) => createReply(content, post_id, comment.id, user?.id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["comments", post_id]});
            queryClient.invalidateQueries({queryKey: ["comment_count", comment.id, false]});
            setContent("");
        }
    });

    const { mutate: deleteMutate } = useMutation({
        mutationFn: (comment_id: number) => {
            return deleteComment(comment_id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["comments", post_id]});
            queryClient.invalidateQueries({queryKey: ["comment_count", comment.post_id, true]});
            if(comment.parent_comment_id) {
                queryClient.invalidateQueries({queryKey: ["comment_count", comment.id, false]});
            }
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if(!content) return;

        mutate(content);
    }

    const handleDelete = () => {
        setShowDeleteConfirmation(true);
    }

    const handleCancel = () => {
        setShowDeleteConfirmation(false);
    }

    const handleDeleteConfirm = () => {
        setShowDeleteConfirmation(false);
        deleteMutate(comment.id);
    }

    const is_creator = () => {
        return user?.id === comment.user_id;
    }

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200 my-4">
            <div className="flex items-center mb-2">
                <div className="w-10 h-10 mr-3 rounded-full overflow-hidden">
                <img src={poster?.image_url || "/default-profile.png"} alt={`User avatar`} className="w-full h-full object-cover" />
                </div>
                <div>
                <p 
                    className="inline-block font-semibold text-sm cursor-pointer hover:underline" 
                    onClick={() => navigate(`/profile/${poster?.username}`)}
                >
                    {poster?.username}
                </p>
                <TimeDisplay timestamp={comment.created_at} />
                </div>
                {user && is_creator() &&
                    <span className="ml-auto cursor-pointer" onClick={handleDelete}>🗑️</span>
                }
            </div>

            {showDeleteConfirmation && 
                <DeleteConfirmation
                    isOpen={showDeleteConfirmation}
                    isPost={false}
                    onCancel={handleCancel}
                    onConfirm={handleDeleteConfirm}
                />
            }

            <div className="mb-4">
                <p className="text-base">{comment.content}</p>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
                <LikeButton post_id={comment.id} is_post={false}/>
                <div className="flex items-center">
                <span className="mr-1 cursor-pointer" onClick={() => setShowReply((prev) => !prev)}>💬</span>
                <span>{comment_count}</span>
                </div>
            </div>

            {showReply && user && 
                <>
                    <form onSubmit={handleSubmit} className="flex flex-col items-end mt-4">
                        <textarea
                            value={content}
                            rows={3}
                            placeholder="Write a comment..."
                            className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-[20%] h-8 rounded bg-blue-600 font-bold text-white cursor-pointer mt-2"
                            disabled={!content}
                        >
                            {isPending ? "Posting..." : "Post"}
                        </button>
                        {isError && <p>Error posting comment</p>}
                    </form>
                    {comment.children && comment.children.length > 0 && 
                        <div>
                            {comment.children.map((child, key) => <Comment key={key} comment={child} post_id={post_id}/>)}
                        </div>
                    }
                </>
            }
        </div>
    )
}