import { useState } from "react";
import { CommentType } from "./CommentSection"
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { calculateTime } from "./Post";
import LikeButton from "./LikeButton";

interface Props {
    comment: CommentType & {
        children?: CommentType[];
    };
    post_id: number;
}

const createReply = async(content: string, post_id: number, parent_comment_id: number, user_id?: string, email?: string, avatar_url?: string) => {
    if(!user_id) {
        throw new Error("You must be logged in to reply");
    }

    const { error } = await supabase.from("comments").insert({
        post_id: post_id,
        content: content,
        parent_comment_id: parent_comment_id,
        user_id: user_id,
        email: email,
        avatar_url: avatar_url
    });

    if(error) throw new Error(error.message);
}

export default function Comment({ comment, post_id }: Props) {
    const [showReply, setShowReply] = useState<boolean>(false);
    const [content, setContent] = useState<string>("");

    const { user } = useAuth();
    const queryClient = useQueryClient();
    
    const { mutate, isPending, isError } = useMutation({
        mutationFn: (content: string) => createReply(content, post_id, comment.id, user?.id, user?.user_metadata.email, user?.user_metadata.avatar_url),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["comments", post_id]});
            setContent("");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if(!content) return;

        mutate(content);
    }

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200 my-4">
            <div className="flex items-center mb-2">
                <div className="w-10 h-10 mr-3 rounded-full overflow-hidden">
                <img src={comment.avatar_url} alt={`User avatar`} className="w-full h-full object-cover" />
                </div>
                <div>
                <p className="font-semibold text-sm">{comment.email}</p>
                <p className="text-gray-500 text-xs">{calculateTime(comment.created_at)}</p>
                </div>
            </div>

            <div className="mb-4">
                <p className="text-base">{comment.content}</p>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
                <LikeButton post_id={comment.id} is_post={false}/>
                <div className="flex items-center">
                <span className="mr-1 cursor-pointer" onClick={(e) => setShowReply((prev) => !prev)}>💬</span>
                <span>{0}</span>
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