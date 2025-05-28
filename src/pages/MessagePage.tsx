import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import usePoster from "../hooks/usePoster";
import Messages from "../components/Messages";
import { useState } from "react";

export interface MessageType {
    id: number;
    created_at: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    read: boolean;
};

interface NewMessage {
    sender_id: string;
    receiver_id: string;
    content: string;
};

const getMessages = async(user1: string, user2: string): Promise<MessageType[]> => {
    const { data, error } = await supabase
        .from("messages").select("*")
        .or(`and(sender_id.eq.${user1},receiver_id.eq.${user2}),and(sender_id.eq.${user2},receiver_id.eq.${user1})`);

    if(error) throw new Error(error.message);

    return data as MessageType[];
}

const createMessage = async (message: NewMessage) => {
    const {data, error} = await supabase.from("messages").insert(message);

    if(error) throw new Error(error.message);

    return data;
};

export default function MessagePage() {
    const [content, setContent] = useState<string>("");

    const { user: user2 } = useParams<{user: string}>();
    const { user } = useAuth();
    const { data: user1_data } = usePoster(user?.id, { enabled: !!user });
    const { data: user2_data } = usePoster(user2, { enabled: true, username: true });

    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error: error2 } = useMutation({
        mutationFn: (message: NewMessage) => {
            return createMessage(message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["messages", user1_data?.id, user2_data!.id]});
        }
    });

    const { data, isLoading, error } = useQuery<MessageType[], Error>({
        queryKey: ["messages", user1_data?.id, user2_data?.id],
        queryFn: () => getMessages(user!.id, user2_data!.id)
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if(!user1_data || !user2_data) return;

        mutate({sender_id: user1_data?.id, receiver_id: user2_data?.id, content});
        setContent("");
    }

    if(isLoading || !user1_data || !user2_data) return <div className="text-white">Loading messages...</div>

    if(error) return <div className="text-white">Failed to load messages</div>

    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center mt-4 bg-gray-100 w-[80%] rounded-t-lg h-15 justify-center">
                <div className="w-10 h-10 mr-3 rounded-full overflow-hidden">
                    <img src={user2_data?.image_url || "/default-profile.png"} alt={`User avatar`} className="w-full h-full object-cover" />
                </div>
                <h1 className="font-semibold text-xl">{user2_data.username}</h1>
            </div>
            <Messages messages={data} user1={user1_data} user2={user2_data} />
            <form className="w-[80%] mt-2 flex gap-2" onSubmit={handleSubmit}>
                <input 
                    type="text"
                    placeholder="Enter message... (300 character limit)" 
                    className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    maxLength={300}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></input>
                <button className="md:w-[20%] rounded bg-blue-600 font-bold text-white cursor-pointer max-sm:mt-2" disabled={isPending}>
                    {isPending ? "Sending..." : "Send"}
                </button>
            </form>
            {isError && <p className="text-red-500">Failed to send the message</p>}
        </div>
    );
}