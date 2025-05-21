import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AccountMenu from "./AccountMenu";
import usePoster from "../hooks/usePoster";

export default function NavBar() {
    const {signOut, user} = useAuth();

    const { data } = usePoster(user!.id);
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 w-full bg-black">
            <div className="px-5 mx-auto h-15 flex items-center justify-between">
                <Link to="/" className="font-mono font-bold text-white text-xl">Social Media</Link>
                {user ? (
                    <>
                        <div className="flex items-center space-x-5">
                            {user.user_metadata?.avatar_url && (
                                <img 
                                    src={user.user_metadata.avatar_url}
                                    alt="User avatar"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            )}
                        </div>
                        <AccountMenu username={data!.username} profile={() => {}} signOut={signOut}/>
                    </>
                ) : (
                    <div className="flex gap-2">
                        <button
                            className="p-2 rounded bg-blue-500 cursor-pointer text-white font-bold"
                            onClick={() => navigate("/signin")}
                        >
                            Sign in
                        </button>
                        <button
                            className="p-2 rounded bg-orange-500 cursor-pointer text-white font-bold"
                            onClick={() => navigate("/signup")}
                        >
                            Sign up
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}