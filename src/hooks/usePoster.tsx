import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";

export interface User {
    id: string;
    created_at: string;
    username: string;
    email: string;
    date_of_birth: string;
    image_url: string;
}

const getUserById = async (user_id: string) => {
    const { data, error } = await supabase.from("users").select("*").eq("id", user_id).single();
    
    if(error) throw new Error(error.message);

    return data;
}

const getUserByUsername = async (username: string) => {
    const { data, error } = await supabase.from("users").select("*").eq("username", username).single();
    
    if(error) throw new Error(error.message);

    return data;
}

export default function usePoster(user_id: string | undefined, options? : { enabled: boolean, username?: boolean }) {
    if(!options?.username) {
        return useQuery<User | null, Error>({
            queryKey: ["user", user_id],
            queryFn: () => getUserById(user_id!),
            enabled: options?.enabled
        });
    } else {
        return useQuery<User | null, Error>({
            queryKey: ["user", user_id],
            queryFn: () => getUserByUsername(user_id!),
            enabled: options?.enabled
        });
    }
}