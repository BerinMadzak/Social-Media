import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileMenu from "./ProfileMenu";
import usePoster from "../hooks/usePoster";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useEffect, useRef, useState } from "react";
import UnreadMessage from "./UnreadMessage";

export interface UnreadMessageData {
    sender_id: string;
    username: string;
    image_url: string;
    count: number;
}

const getUnreadMessageData = async (user_id: string) => {
    const { data, error } = await supabase.rpc('get_unread_message_data', { user_id: user_id });

    if(error) throw new Error(error.message);

    return data;
}

export default function NavBar() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const {signOut, user, loading} = useAuth();
    
    const { data } = usePoster(user?.id, { enabled: !!user });
    const navigate = useNavigate();

    const profile = () => {
        navigate(`/profile/${data?.username}`);
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
    };
    
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const { data: unread_message_data } = useQuery<UnreadMessageData[], Error>({
        queryKey: ["unread_message_data"],
        queryFn: () => getUnreadMessageData(user!.id),
        refetchInterval: 5000,
        enabled: !loading
    });    

    const totalUnread = unread_message_data?.reduce((acc: number, message: UnreadMessageData) => acc + message.count,0) ?? 0;

    return (
        <nav className="fixed top-0 w-full bg-black z-50"   >
            <div className="px-5 mx-auto h-15 flex items-center justify-between">
                <Link to="/" className="font-mono font-bold text-white text-xl">Social Media</Link>
                {user ? (
                    <div className="flex gap-3 items-center">
                        <div className="relative cursor-pointer">
                            <span className="text-2xl" onClick={() => setOpen(true)}>✉️</span>
                            {unread_message_data && unread_message_data.length > 0 &&
                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 
                                text-xs font-bold leading-none text-white bg-red-600 rounded-full min-w-[18px] h-[18px]">
                                    {totalUnread}
                                </span>
                            }
                        </div>
                        {data && <ProfileMenu username={data!.username} profile={profile} signOut={signOut}/>}
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <button
                            className="p-2 rounded bg-blue-500 cursor-pointer text-white font-bold"
                            onClick={() => navigate("/signin")}
                        >
                            Sign in
                        </button>
                        <button
                            className="p-2 rounded bg-orange-500 cursor-pointer text-white font-bold"
                            onClick={() => navigate("/signup")}
                        >
                            Sign up
                        </button>
                    </div>
                )}
            </div>
            {open && 
                <div ref={dropdownRef} className="w-72 bg-white absolute right-0 mt-2 rounded-md shadow-lg ring-black ring-opacity-5 z-50 overflow-auto max-h-64">
                    {unread_message_data && unread_message_data.length === 0 ? 
                        (
                            <p className="p-4 text-center text-gray-500">No unread messages</p>
                        ) : (
                            <div>
                                {unread_message_data?.map((data, key) => <UnreadMessage key={key} data={data} setOpen={setOpen}/>)}
                            </div>
                        )
                    }
                </div>
            }
        </nav>
    );
}