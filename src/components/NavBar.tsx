import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileMenu from "./ProfileMenu";
import usePoster from "../hooks/usePoster";

export default function NavBar() {
    const {signOut, user} = useAuth();

    const { data } = usePoster(user?.id, { enabled: !!user });
    const navigate = useNavigate();

    const profile = () => {
        navigate(`/profile/${data?.username}`);
    }

    return (
        <nav className="fixed top-0 w-full bg-black z-50">
            <div className="px-5 mx-auto h-15 flex items-center justify-between">
                <Link to="/" className="font-mono font-bold text-white text-xl">Social Media</Link>
                {user ? (
                    <>
                        {data && <ProfileMenu username={data!.username} profile={profile} signOut={signOut}/>}
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