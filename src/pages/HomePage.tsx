import NewPost from "../components/NewPost";
import Posts from "../components/Posts";

export default function HomePage() {
  return (
    <div className="bg-gray-800 h-[calc(100vh-3.75rem)] overflow-y-auto flex justify-center">
      <div className="flex flex-col mt-10 w-[50%] gap-10">
        <NewPost />
        <Posts />
      </div>
    </div>
  )
}

