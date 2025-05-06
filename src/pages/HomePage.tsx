import NewPost from "../components/NewPost";

export default function HomePage() {
  return (
    <div className="bg-gray-800 h-[calc(100vh-3.75rem)] overflow-y-auto">
      <div className="flex justify-center mt-10">
        <NewPost />
      </div>
    </div>
  )
}

