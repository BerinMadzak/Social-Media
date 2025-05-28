import { useEffect, useRef } from "react";
import { User } from "../hooks/usePoster";
import { MessageType } from "../pages/MessagePage";
import Message from "./Message";

interface Props {
    messages: MessageType[] | undefined;
    user1: User;
    user2: User;
}

export default function Messages( { messages, user1, user2 }: Props) {
    const messageRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messageRef.current?.scrollIntoView({behavior: 'smooth'});
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