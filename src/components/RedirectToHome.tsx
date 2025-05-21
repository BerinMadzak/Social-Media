import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export default function RedirectToHome({ children }: Props) {
    const { user } = useAuth();
    
    if(user) return <Navigate to="/" replace />;

    return children;
}