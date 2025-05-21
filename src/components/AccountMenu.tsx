import { useEffect, useRef, useState } from "react";
import usePoster from "../hooks/usePoster";
import { useAuth } from "../context/AuthContext";

interface Props {
    username: string;
    profile: () => void;
    signOut: () => void;
}

export default function AccountMenu({ username, profile, signOut }: Props) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const { user } = useAuth();
    const { data } = usePoster(user!.id);

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
        <button
            onClick={() => setOpen(!open)}
            className="focus:outline-none  cursor-pointer"
        >
            <img
                src={data?.image_url ? data.image_url : "/default-profile.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-blue-500 transition"
            />
        </button>

        {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black/10 z-50">
                <p className="py-2 px-2 text-semibold">Welcome, {username}!</p><hr />
                <ul className="py-1 text-sm text-gray-700">
                    <li>
                        <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => profile()}
                        >
                            Profile
                        </button>
                    </li>
                    <li>
                        <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => signOut()}
                        >
                            Sign Out
                        </button>
                    </li>
                </ul>
            </div>
        )}
        </div>
    );
}