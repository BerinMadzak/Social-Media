import { useAuth } from "../context/AuthContext";
import { User } from "../hooks/usePoster";

interface Props {
    user: User | null | undefined;
}

export default function ProfileBanner({ user }: Props) {
    const { user: current_user } = useAuth();

    if(user === null || user === undefined) return <div className="text-white">Loading...</div>

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 w-[60%]">
            <div className="flex flex-col items-center mb-2">
                <div className="relative w-30 h-30 mr-3 rounded-full overflow-hidden border-3 border-transparent hover:border-blue-300">
                    <img 
                        src={user.image_url || "/default-profile.png"} 
                        alt={`User avatar`} 
                        className="w-full h-full object-cover" 
                    />
                   
                </div>
                <div className="flex gap-2 items-center">
                    <p className="font-semibold text-xl mt-2">{user.username}</p>
                    {current_user?.id === user.id && <p className="text-xl pt-2 cursor-pointer">✉️</p>}
                </div>
            </div>
        </div>
    );
}