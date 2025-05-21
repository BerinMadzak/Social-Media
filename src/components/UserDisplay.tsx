import { useNavigate } from "react-router-dom";
import { User } from "../hooks/usePoster";

interface Props {
    user: User;
}

export default function UserDisplay({ user }: Props) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/profile/${user.username}`);
    }

    return ( 
        <div className="flex items-center h-15 p-2 shadow-md" onClick={handleClick}>
            <div className="w-10 h-10 mr-3 rounded-full overflow-hidden">
                <img src={user.image_url || "/default-profile.png"} alt={`User avatar`} className="w-full h-full object-cover" />
            </div>
            <p>{user.username}</p>
        </div>
    );
}