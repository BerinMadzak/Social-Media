import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { User } from "../hooks/usePoster";
import { supabase } from "../supabase-client";
import { useNavigate } from "react-router-dom";

interface Props {
    user: User | null | undefined;
}

const uploadImage = async (image: File, user: User) => {
    const path = `${Date.now()}-${user.username}`;

    const { error } = await supabase.storage.from("profile-images").upload(path, image);

    if(error) throw new Error(error.message);

    const { data } = supabase.storage.from("profile-images").getPublicUrl(path);

    return data.publicUrl;
}

const changeProfilePicture = async (image: File, user: User) => {
    const image_url = await uploadImage(image, user);

    const {data, error} = await supabase.from("users").update({image_url: image_url}).eq("id", user.id);

    if(error) throw new Error(error.message);

    user.image_url = image_url;

    return data;
};

export default function ProfileBanner({ user }: Props) {
    const { user: current_user } = useAuth();
    
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: (data: {image: File, user: User}) => {
            return changeProfilePicture(data.image, data.user);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["user", user?.id]});
        }
    });
    
    const handleUploadProfilePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!user) return;

        if(current_user?.id !== user.id) return;
        
        const file = e.target.files?.[0];
        if(file) mutate({
            image: file, user: user
        });
    }
    
    if(user === null || user === undefined) return <div className="text-white">Loading...</div>

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb w-[60%]">
            <div className="flex flex-col items-center mb-2">
                <div 
                    className={"relative w-30 h-30 mr-3 rounded-full overflow-hidden border-3 border-transparent " 
                        + (current_user?.id === user.id ? "hover:border-black transition-all duration-100" : "")}
                >
                    <img 
                        src={user.image_url || "/default-profile.png"} 
                        alt={`User avatar`} 
                        className="absolute top-0 left-0 w-full h-full object-cover" 
                    />
                    {current_user?.id === user.id && 
                        <label htmlFor="image">
                            <img 
                                src={"/upload-photo.png"}  
                                className="absolute top-0 left-0 w-full h-full object-cover bg-[rgba(0,0,0,0.3)] opacity-0 hover:opacity-100 transition-all duration-100 cursor-pointer" 
                            />
                        </label>
                    }
                    <input 
                        id="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUploadProfilePicture}
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <p className="font-semibold text-xl mt-2">{user.username}</p>
                    {current_user?.id !== user.id && 
                        <p className="text-xl pt-2 cursor-pointer" onClick={() => navigate(`/messages/${user.username}`)}>✉️</p>
                    }
                </div>
            </div>
        </div>
    );
}