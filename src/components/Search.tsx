import { useState } from "react";

interface Props {
    onSearch: (query: string) => void;
}

export default function Searchbar({ onSearch }: Props) {
    const [query, setQuery] = useState<string>("");

    return(
        <div className="relative">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {if(e.key === 'Enter') onSearch(query)}} 
                placeholder="Search..."
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
        </div>  
    );
}