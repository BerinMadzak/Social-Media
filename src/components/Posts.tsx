import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import Post from "./Post";
import { useState } from "react";

interface Props {
    user: string;
}

export interface PostType {
    id: number;
    created_at: string;
    content: string;
    image_url?: string;
    avatar_url: string;
    user_id: string;
};

const getPosts = async (user: string): Promise<PostType[]> => {
    let query = supabase.from("posts").select("*").limit(10).order("created_at", {ascending: false});
    if(user !== "") {
        const { data } = await supabase.from("users").select("id").eq("username", user).single();
        console.log(data?.id);
        query = query.eq("user_id", data?.id);
    }
    
    const { data, error } = await query;

    if(error) throw new Error(error.message);

    return data as PostType[];
}

export default function Posts({ user }: Props) {
    const [displayImage, setDisplayImage] = useState<string | null>(null);

    const { data, error, isLoading } = useQuery<PostType[], Error>({queryKey: ["posts"], queryFn: () => getPosts(user)});

    if(isLoading) return <div className="text-white">Loading...</div>;

    if(error) return <div className="text-red">{error.message}</div>;

    return (
        <div>
            {displayImage &&
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.8)] flex justify-center items-center z-50" onClick={() => setDisplayImage(null)} >
                    <img 
                        src={displayImage} 
                        alt="Post image" 
                        className="max-w-full max-h-full object-contain cursor-pointer"
                    />
                </div>
            }
            <div className="flex flex-wrap flex-column gap-6 justify-center">
                {data?.map((post, key) => (<Post post={post} setDisplayImage={setDisplayImage} key={key} />))}
            </div>
        </div>
    );
}