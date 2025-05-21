import { useRef, useState } from "react";
import { supabase } from "../supabase-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

interface NewPost {
    content: string;
    user_id: string;
}

const uploadImage = async (image: File) => {
    const path = `${Date.now()}-${image.name}`;
    
    const { error } = await supabase.storage.from("post-images").upload(path, image);

    if(error) throw new Error(error.message);

    const { data } = supabase.storage.from("post-images").getPublicUrl(path);

    return data.publicUrl;
}

const createPost = async (post: NewPost, image: File | null) => {
    let image_url = null;
    if(image !== null) image_url = await uploadImage(image);

    const {data, error} = await supabase.from("posts").insert({...post, image_url});

    if(error) throw new Error(error.message);

    return data;
};

export default function NewPost() {
    const [content, setContent] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { mutate, isPending, isError } = useMutation({
        mutationFn: (data: {post: NewPost, image: File | null}) => {
            return createPost(data.post, data.image);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["posts"]});
        }
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        mutate({
            post: {content, user_id: user!.id}, image: file
        });
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file) {
            setFile(file);
        }
    }

    const handleRemoveFile = () => {
        setFile(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea 
                cols={100} 
                rows={5} 
                placeholder="Share your thoughts... (300 character limit)" 
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                maxLength={300}
                required
                onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <div className="flex gap-x-2 flex-col md:flex-row">
                <div className="flex flex-col items-center justify-center w-full">
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
                    {file && (
                        <div className="flex flex-col items-center w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-md shadow-md h-full">
                            <p>Selected file:</p>
                            <p className="w-full max-sm:truncate w-40 text-center">{file.name}</p>
                            <button 
                                onClick={handleRemoveFile} 
                                className="ml-4 mt-2 py-1 px-3 border border-red rounded text-sm text-red-500 hover:text-red-700 focus:outline-none"
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>
                <button className="md:w-[20%] rounded bg-blue-600 font-bold text-white cursor-pointer max-sm:mt-2" disabled={isPending}>
                    {isPending ? "Posting..." : "Post"}
                </button>
            </div>
            {isError && <p className="text-red-500">Error creating a post</p>}
        </form>
    );
}