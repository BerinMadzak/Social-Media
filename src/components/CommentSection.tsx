import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";
import { useMutation } from "@tanstack/react-query";

interface Props {
    post_id: number;
}

interface CommentType {
    content: string;
    parent_comment_id?: number | null;
}

const createCommment = async (comment: CommentType, post_id: number, user_id?: string, email?: string, avatar_url?: string) => {
    if(!user_id) throw new Error("You must be logged in to comment");

    const { error } = await supabase.from("comments").insert({
        post_id: post_id,
        content: comment.content,
        parent_comment_id: comment.parent_comment_id || null,
        user_id: user_id,
        email: email,
        avatar_url: avatar_url
    });

    if(error) throw new Error(error.message);
}

export default function CommentSection({ post_id }: Props) {
    const [content, setContent] = useState<string>("");
    const { user } = useAuth();

    const { mutate, isPending, isError } = useMutation({
        mutationFn: (comment: CommentType) => createCommment(comment, post_id, user?.id, user?.user_metadata.email, user?.user_metadata.avatar_url)
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if(!content) return;

        mutate({content: content, parent_comment_id: null});
        setContent("");
    }
    
    return (
        <div>
            <h3 className="text-xl mb-4 font-semibold">Comments</h3>
            {user ? (
                <form onSubmit={handleSubmit} className="flex flex-col items-end">
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
            ) : (
                <p>You must be logged in to comment</p>
            )}
        </div>
    );
}