export default function NewPost() {
    return (
        <form>
            <textarea cols={100} rows={10} placeholder="Enter text..." className="bg-blue-100 resize-none p-2"></textarea>
            <div className="flex gap-x-2">
                <button className="w-[80%] h-8 bg-red-100 cursor-pointer text-gray-800">Attach Image</button>
                <button className="w-[20%] rounded bg-red-600 font-bold text-white cursor-pointer">Post</button>
            </div>
        </form>
    );
}