import { PostType } from "./Posts";

interface Props {
    post: PostType;
};

const calculateTime = (created_at: string) => {
    const now = new Date();
    const createdDate = new Date(created_at);
    const seconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if(seconds < 60) return `${seconds} seconds ago`;
    if(minutes < 60) return `${minutes} minutes ago`;
    if(hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
}

export default function Post({ post }: Props) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 w-[80%]">
            <div className="flex items-center mb-2">
                <div className="w-10 h-10 mr-3 rounded-full overflow-hidden">
                <img src={post.avatar_url} alt={`User avatar`} className="w-full h-full object-cover" />
                </div>
                <div>
                <p className="font-semibold text-sm">{post.email}</p>
                <p className="text-gray-500 text-xs">{calculateTime(post.created_at)}</p>
                </div>
            </div>

            <div className="mb-4">
                <p className="text-base">{post.content}</p>
                {post.image_url && (
                <img src={post.image_url} alt="Post image" className="w-full mt-4 rounded-lg object-cover h-60 max-w-full" />
                )}
            </div>

            <div className="flex justify-between text-sm text-gray-600">
                <div className="flex items-center">
                <span className="mr-1">🤍❤️</span>
                <span>{0}</span>
                </div>
                <div className="flex items-center">
                <span className="mr-1">💬</span>
                <span>{0}</span>
                </div>
            </div>
        </div>
    );
}