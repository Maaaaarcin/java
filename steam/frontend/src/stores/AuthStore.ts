import {create} from "zustand";
import axios from "axios";

export interface User {
    userId: number;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    coins: number;
    role: string;
    createdAt?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
    setUser: (user: AuthState['user']) => void;
    updateUserInfo: (updatedUser: Partial<User>) => void;
    register: (firstName: string, lastName: string, username: string, password: string) => Promise<void>;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    isLoading: true,
    setUser: (user: AuthState['user']) => {
        set({ user });
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    },
    updateUserInfo: (updatedUser: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedFullUser = {
            ...currentUser,
            ...updatedUser
        };

        set({
            user: updatedFullUser,
            isAdmin: updatedUser.role ? updatedUser.role === "ADMIN" : get().isAdmin
        });
        localStorage.setItem("user", JSON.stringify(updatedFullUser));
    },
    register: async (firstName: string, lastName: string, username: string, password: string) => {
        try {
            await axios.post(
                "http://localhost:8080/auth/register",
                {firstName, lastName, username, password},
                {withCredentials: true}
            );
            await get().login(username, password);
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    },
    login: async (username: string, password: string) => {
        try {
            const response = await axios.post(
                "http://localhost:8080/auth/login",
                {username, password},
                {withCredentials: true}
            );

            const user = response.data;
            localStorage.setItem("user", JSON.stringify(user));

            set({
                user,
                isAuthenticated: true,
                isAdmin: user.role === "ADMIN"
            });
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    },
    logout: async () => {
        try {
            await axios.post(
                "http://localhost:8080/auth/logout",
                null,
                {withCredentials: true}
            );

            localStorage.removeItem("user");

            set({user: null, isAuthenticated: false, isAdmin: false});
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        }
    },
    checkAuth: async () => {
        set({isLoading: true});
        try {
            const response = await axios.get(
                "http://localhost:8080/auth/user",
                {withCredentials: true}
            );

            const user = response.data;
            const isAdmin = user.role === "ADMIN";

            localStorage.setItem("user", JSON.stringify(user));
            set({user, isAuthenticated: true, isAdmin, isLoading: false});
        } catch (error) {
            console.error("Auth check failed:", error);

            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                try {
                    const user = JSON.parse(savedUser);
                    const isAdmin = user.role === "ADMIN";
                    set({user, isAuthenticated: true, isAdmin, isLoading: false});
                } catch (parseError) {
                    console.error("Error parsing saved user:", parseError);
                    localStorage.removeItem("user");
                    set({user: null, isAuthenticated: false, isAdmin: false, isLoading: false});
                }
            } else {
                set({user: null, isAuthenticated: false, isAdmin: false, isLoading: false});
            }
        }
    }
}));

export default useAuthStore;