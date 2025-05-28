import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    logged: boolean;
}

export default function RedirectToHome({ children, logged }: Props) {
    const { user, loading } = useAuth();
    
    if(loading) return null;
    
    if((logged && !!user) || (!logged && !user)) return <Navigate to="/" replace />;

    return children;
}