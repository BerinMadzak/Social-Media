import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";

interface Props {
    postId: number;
};

interface Like {
    id: number;
    post_id: number;
    user_id: string;
};

const like = async(postId: number, userId: string) => {
    const { data } = await supabase.from("likes").select("*").eq("post_id", postId).eq("user_id", userId).maybeSingle();

    if(data) {
        const { error } = await supabase.from("likes").delete().eq("id", data.id);

        if(error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from("likes").insert({post_id: postId, user_id: userId});
    
        if(error) throw new Error(error.message);
    }
}

const getLikes = async(postId: number): Promise<Like[]> => {
    const { data, error } = await supabase.from("likes").select("*").eq("post_id", postId);

    if(error) throw new Error(error.message);
    return data as Like[];
}

export default function LikeButton({postId}: Props) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery<Like[], Error>({
        queryKey: ["likes", postId],
        queryFn: () => getLikes(postId),
        refetchInterval: 5000
    });

    const { mutate } = useMutation({ 
        mutationFn: () => {
            if(!user) throw new Error("You must be logged in to like");
            return like(postId, user.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["likes", postId]});
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