import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";

interface Props {
    post_id: number;
    is_post: boolean;
};

interface Like {
    id: number;
    post_id?: number;
    comment_id?: number;
    user_id: string;
};

const like = async(id: number, user_id: string, is_post: boolean) => {
    if(is_post) {
        const { data } = await supabase.from("likes").select("*").eq("post_id", id).eq("user_id", user_id).maybeSingle();
    
        if(data) {
            const { error } = await supabase.from("likes").delete().eq("id", data.id);
    
            if(error) throw new Error(error.message);
        } else {
            const { error } = await supabase.from("likes").insert({post_id: id, user_id: user_id});
        
            if(error) throw new Error(error.message);
        }
    } else {
        const { data } = await supabase.from("likes").select("*").eq("comment_id", id).eq("user_id", user_id).maybeSingle();
    
        if(data) {
            const { error } = await supabase.from("likes").delete().eq("id", data.id);
    
            if(error) throw new Error(error.message);
        } else {
            const { error } = await supabase.from("likes").insert({comment_id: id, user_id: user_id});
        
            if(error) throw new Error(error.message);
        }
    }
}

const getLikes = async(id: number, is_post: boolean): Promise<Like[]> => {
    if(is_post) {
        const { data, error } = await supabase.from("likes").select("*").eq("post_id", id);
    
        if(error) throw new Error(error.message);
        return data as Like[];
    } else {
        const { data, error } = await supabase.from("likes").select("*").eq("comment_id", id);
    
        if(error) throw new Error(error.message);
        return data as Like[];
    }
}

export default function LikeButton({post_id, is_post}: Props) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery<Like[], Error>({
        queryKey: ["likes", post_id, is_post],
        queryFn: () => getLikes(post_id, is_post),
        refetchInterval: 5000
    });

    const { mutate } = useMutation({ 
        mutationFn: () => {
            if(!user) throw new Error("You must be logged in to like");
            return like(post_id, user.id, is_post);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["likes", post_id, is_post]});
        }
    });

    if(isLoading) return <div>Loading likes...</div>

    if(error) return <div>{error.message}</div>

    const likes = data?.length;
    const userLike = data?.find((u) => u.user_id === user?.id);

    return (
        <div className="flex items-center cursor-pointer" onClick={() => mutate()}>
            <span className="mr-1">
                {!userLike ? "🤍" : "❤️" }
            </span>
            <span>{likes}</span>
        </div>
    );
}