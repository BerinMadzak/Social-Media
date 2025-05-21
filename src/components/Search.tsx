import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabase-client";
import { useQuery } from "@tanstack/react-query";
import { User } from "../hooks/usePoster";
import UserDisplay from "./UserDisplay";

interface Props {
    onSearch: (query: string) => void;
}

const getUsers = async (query: string): Promise<User[]> => {
    if(query === "") return [];

    const { data, error } = await supabase.from("users").select("*").ilike("username", `%${query}%`).limit(5);

    if(error) throw new Error(error.message);

    return data as User[];
}

export default function Searchbar({ onSearch }: Props) {
    const [query, setQuery] = useState<string>("");
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const { data: users } = useQuery<User[], Error>({
        queryKey: ["users", query],
        queryFn: () => getUsers(query),
    });

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }

    return(
        <div>
            <div className="relative" ref={menuRef}>
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onKeyDown={(e) => {if(e.key === 'Enter') onSearch(query)}} 
                    placeholder="Search..."
                    onFocus={() => setOpen(true)}
                    className="w-full px-4 py-2 text-gray-300 bg-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none pl-10"
                />
                <svg
                    className="absolute top-3 left-3 w-5 h-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 2a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm0 16a6 6 0 1 1 6-6 6 6 0 0 1-6 6zm5.5 0l3.5 3.5"
                    />
                </svg>
                {users && open && users.length > 0 && 
                    <div className="absolute left-0 mt-1 border border-2 rounded w-full bg-white hover:bg-gray-100 cursor-pointer">
                        {users.map((user, key) => <UserDisplay key={key} user={user}/>)}
                    </div>
                }
            </div>  
        </div>
    );
}