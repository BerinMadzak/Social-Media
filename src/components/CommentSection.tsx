import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Comment from "./Comment";

interface Props {
    post_id: number;
}

interface NewComment {
    content: string;
    parent_comment_id?: number | null;
}

export interface CommentType {
    id: number;
    created_at: string;
    post_id: number;
    content: string;
    user_id: string;
    parent_comment_id?: number | null;
}

const createCommment = async (comment: NewComment, post_id: number, user_id?: string, email?: string, avatar_url?: string) => {
    if(!user_id) throw new Error("You must be logged in to comment");

    const { error } = await supabase.from("comments").insert({
        post_id: post_id,
        content: comment.content,
        parent_comment_id: comment.parent_comment_id || null,
        user_id: user_id,
    });

    if(error) throw new Error(error.message);
}

const getComments = async(post_id: number): Promise<CommentType[]> => {
    const { data, error } = await supabase
        .from("comments").select("*").eq("post_id", post_id).order("created_at", { ascending: false });

    if(error) throw new Error(error.message);

    return data as CommentType[];
}

const createCommentTree = (comments: CommentType[]): (CommentType & {children?: CommentType[]})[] => {
    const map = new Map<number, CommentType & {children?: CommentType[]}>();
    const roots: (CommentType & {children?: CommentType[]})[] = [];

    comments.forEach((comment) => {
        map.set(comment.id, {...comment, children: []});
    });

    comments.forEach((comment) => {
        if(comment.parent_comment_id) {
            const parent = map.get(comment.parent_comment_id);
            if(parent) {
                parent.children!.push(map.get(comment.id)!);
            }
        } else {
            roots.push(map.get(comment.id)!);
        }
    });

    return roots;
}

export default function CommentSection({ post_id }: Props) {
    const [content, setContent] = useState<string>("");
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery<CommentType[], Error>({
        queryKey: ["comments", post_id],
        queryFn: () => getComments(post_id)
    });

    const { mutate, isPending, isError } = useMutation({
        mutationFn: (comment: NewComment) => 
            createCommment(comment, post_id, user?.id, user?.user_metadata.email, user?.user_metadata.avatar_url),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["comments", post_id]});
            queryClient.invalidateQueries({queryKey: ["comment_count", post_id, true]});
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if(!content) return;

        mutate({content: content, parent_comment_id: null});
        setContent("");
    };

    if(isLoading) return <div>Loading comments...</div>

    if(isError) return <div>{error?.message}</div>

    const commentTree = data ? createCommentTree(data) : [];
    
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

            <div className="mt-3">
                {commentTree.map((comment, key) => ( 
                   <Comment key={key} comment={comment} post_id={post_id} /> 
                ))}
            </div>
        </div>
    );
}