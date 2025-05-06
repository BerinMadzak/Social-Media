import { useRef, useState } from "react";

export default function NewPost() {
    const [content, setContent] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file) {
            setFileName(file.name);
        }
    }

    const handleRemoveFile = () => {
        setFileName(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <form>
            <textarea 
                cols={100} 
                rows={6} 
                placeholder="Share your thoughts... (300 character limit)" 
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                maxLength={300}
                required
            ></textarea>
            <div className="flex gap-x-2">
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg 
                                className="w-8 h-8 mb-4 text-gray-500" 
                                fill="none" 
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"    
                            >
                                <path 
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M7 16V4m0 0L3 8m4-4l4 4M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2"
                                />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">Only image files (PNG, JPG)</p>
                        </div>
                        <input 
                            id="image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>
                    {fileName && (
                        <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md shadow-md h-full">
                            Selected file: {fileName}
                            <button 
                                onClick={handleRemoveFile} 
                                className="ml-4 text-sm text-red-500 hover:text-red-700 focus:outline-none"
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>
                <button className="w-[20%] rounded bg-blue-600 font-bold text-white cursor-pointer">Post</button>
            </div>
        </form>
    );
}