import React, {useEffect} from "react";
import {Route, Routes, Navigate, useLocation} from "react-router-dom";
import Layout from "./pages/template/Layout";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NoPage from "./pages/NoPage";
import useAuthStore from "./stores/AuthStore";
import GameOverview from "./components/GameOverview";
import LibraryPage from "./pages/LibraryPage";
import UsersPage from "./pages/UsersPage";

const ProtectedRoute = ({children}: { children: React.ReactNode }) => {
    const {isAuthenticated} = useAuthStore();
    const location = useLocation();

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" state={{from: location}} replace/>;
};

const PublicRoute = ({children}: { children: React.ReactNode }) => {
    const {isAuthenticated} = useAuthStore();
    return isAuthenticated ? <Navigate to="/" replace/> : <>{children}</>;
};

function App() {
    const {checkAuth, isLoading} = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Home/>}/>
                <Route path="users" element={<UsersPage/>}/>
                <Route path="library/:username" element={<LibraryPage/>}/>
                <Route path="/games/:title" element={<GameOverview/>} />
                <Route path="login" element={<PublicRoute><LoginPage/></PublicRoute>}/>
                <Route path="register" element={<PublicRoute><RegisterPage/></PublicRoute>}/>
                <Route path="*" element={<NoPage/>}/>
            </Route>
        </Routes>
    );
}

export default App;