import { useParams } from "react-router-dom";
import Posts from "../components/Posts";

export default function ProfilePage() {
    const { user } = useParams<{user: string}>();
    
    return (
        <div className="flex justify-center">
        <div className="flex flex-col mt-10 w-[50%] gap-10">
            {user && <Posts user={user} search="" />}
        </div>
        </div>
    );
}