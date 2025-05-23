import { useParams } from "react-router-dom";
import Posts from "../components/Posts";
import ProfileBanner from "../components/ProfileBanner";
import usePoster from "../hooks/usePoster";

export default function ProfilePage() {
    const { user } = useParams<{user: string}>();
    const { data } = usePoster(user, { enabled: true, username: true })

    return (
        <div className="flex flex-col justify-center items-center">
            <ProfileBanner user={data} />
            <div className="flex flex-col mt-10 w-[50%] gap-10">
                {user && <Posts user={user} search="" />}
            </div>
        </div>
    );
}