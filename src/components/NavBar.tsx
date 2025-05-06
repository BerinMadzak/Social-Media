import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <nav className="fixed top-0 w-full bg-black">
            <div className="px-5 mx-auto h-15 flex items-center justify-between">
                <Link to="/" className="font-mono font-bold text-white text-xl">Social Media</Link>
                <button className="p-2 rounded bg-orange-500 cursor-pointer text-white font-bold">Sign in with Google</button>
            </div>
        </nav>
    );
}