import { useNavigate } from "react-router-dom";
import { UnreadMessageData } from "./NavBar";

interface Props {
    data: UnreadMessageData;
    setOpen: (value: boolean) => void;
}

export default function UnreadMessage({ data, setOpen }: Props) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/messages/${data.username}`);
        setOpen(false);
    }

    return (
        <div 
            className="flex items-center p-4 m-2 border-gray-800 border bg-gray-200 cursor-pointer"
            onClick={handleClick}
        > 
            <div className="w-10 h-10 mr-3 rounded-full overflow-hidden">
                <img src={data.image_url || "/default-profile.png"} alt={`User avatar`} className="w-full h-full object-cover" />
            </div>
            <p className="inline-block font-semibold text-sm p-1">{data.username}</p>
            <p className="text-sm text-semibold text-white ml-auto rounded-full bg-blue-600 p-2 w-8 h-8 flex justify-center items-center">{data.count}</p>
        </div>
    );
}