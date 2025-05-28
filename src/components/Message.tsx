import { useNavigate } from "react-router-dom";
import { User } from "../hooks/usePoster";
import { MessageType } from "../pages/MessagePage";
import TimeDisplay from "./TimeDisplay";

interface Props {
    message: MessageType;
    sender: User;
}

export default function Message({ message, sender }: Props) {
    const navigate = useNavigate();

    return (
        <div
            className="rounded-lg border p-4 bg-gray-800"
        >
            <div className="flex items-start mb-2">
                <div className="w-10 h-10 mr-3 rounded-full overflow-hidden">
                    <img src={sender?.image_url || "/default-profile.png"} alt={`User avatar`} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                    <div className="flex gap-3 items-start h-full">
                        <p 
                            className="inline-block font-semibold text-sm cursor-pointer hover:underline text-white p-1" 
                            onClick={() => navigate(`/profile/${sender?.username}`)}
                        >
                            {sender?.username}
                        </p>
                        <TimeDisplay timestamp={message.created_at}/>
                    </div>
                    <p className="text-gray-300 px-2">{message.content}</p>
                </div>
            </div>
        </div>
    );
}