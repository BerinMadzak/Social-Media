import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";

interface User {
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

export default function usePoster(user_id: string) {
    const query = useQuery<User | null, Error>({
        queryKey: ["user", user_id],
        queryFn: () => getUserById(user_id)
    });

    return query;
}