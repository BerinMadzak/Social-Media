import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function Layout() {
    return (
        <>
            <NavBar />
            <main className="mt-15">
                <Outlet />
            </main>
        </>
    );
}