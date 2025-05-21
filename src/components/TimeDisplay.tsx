interface Props {
  timestamp: string; 
}

export const calculateTime = (created_at: string) => {
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

export default function TimeDisplay({ timestamp }: Props) {
  const date = new Date(timestamp);
  const postDate = date.toLocaleDateString() + " " + date.toLocaleTimeString();
  const timeAgo = calculateTime(timestamp);

  return (
    <div className="relative group w-[200px]">
      <span className="text-gray-500 text-xs">
        {timeAgo}
      </span>

      <div className="absolute hidden group-hover:block text-xs p-2 bg-gray-800 text-white rounded-md mt-1">
        {postDate} 
      </div>
    </div>
  );
};