import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import Post from "./Post";

export interface PostType {
    id: number;
    created_at: string;
    content: string;
    image_url?: string;
    avatar_url: string;
    email: string;
};

const getPosts = async (): Promise<PostType[]> => {
    const { data, error } = await supabase.from("posts").select("*").limit(10).order("created_at", {ascending: false});

    if(error) throw new Error(error.message);

    return data as PostType[];
}

export default function Posts() {
    const { data, error, isLoading } = useQuery<PostType[], Error>({queryKey: ["posts"], queryFn: getPosts});

    if(isLoading) return <div>Loading...</div>;

    if(error) return <div>{error.message}</div>;

    return (
        <div className="flex flex-wrap flex-column gap-6 justify-center">
            {data?.map((post, key) => (<Post post={post} key={key} />))}
        </div>
    );
}