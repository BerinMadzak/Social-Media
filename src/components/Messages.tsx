import { useEffect, useRef } from "react";
import { User } from "../hooks/usePoster";
import { MessageType } from "../pages/MessagePage";
import Message from "./Message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";

interface Props {
    messages: MessageType[] | undefined;
    user1: User;
    user2: User;
}

const setMessagesAsRead = async (user1: User, user2: User) => {
    const {data, error} = await supabase
        .from("messages").update({read: true})
        .eq("sender_id", user2.id)
        .eq("receiver_id", user1.id)
        .eq("read", false);

    if(error) throw new Error(error.message);

    return data;
};

export default function Messages( { messages, user1, user2 }: Props) {
    const messageRef = useRef<HTMLDivElement | null>(null);

    const queryClient = useQueryClient();

    const { mutate: readMessages } = useMutation({
        mutationFn: () => setMessagesAsRead(user1, user2),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["unread_message_data"]});
        }
    });

    useEffect(() => {
        messageRef.current?.scrollIntoView({behavior: 'smooth'});
        readMessages();
    }, [messages]);

    if(!messages) return <div className="text-white">Loading...</div>;

    return (
        <div className="flex h-[75vh] w-[80%] bg-gray-700 mx-auto py-4">
            <div className="flex flex-col w-full h-full px-4">
                <div className="flex flex-col flex-1 overflow-y-auto space-y-2">
                    {messages.length === 0 ? (
                    <p className="text-white font-semibold text-center mt-4">
                        You have no messages with {user2.username}
                    </p>
                    ) : (
                        messages.map((message, key) => (
                            <Message
                                key={key}
                                message={message}
                                sender={message.sender_id === user1.id ? user1 : user2}
                            />
                        ))
                    )}
                    <div ref={messageRef}></div>
                </div>
            </div>
        </div>
    );
}