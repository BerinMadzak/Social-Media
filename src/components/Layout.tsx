import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function Layout() {
    return (
        <>
            <NavBar />
            <main className="mt-15 bg-gray-800 h-[calc(100vh-3.75rem)] overflow-y-auto">
                <Outlet />
            </main>
        </>
    );
}