import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../stores/AuthStore";

function LoginPage() {
    const { login } = useAuthStore();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e : any) => {
        e.preventDefault();
        setError("");

        try {
            await login(username, password);
        } catch (err) {
            setError("Invalid username or password.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img className="w-8 h-8 mt-1.5 mr-2" src="/logoSTEAM.png" alt="logo" />
                <p>Staem</p>
            </Link>
            <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your account
                    </h1>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button type="submit"
                                className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            Sign in
                        </button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don’t have an account yet?{" "}
                            <Link to="/register" className="font-medium text-blue-600 hover:underline">
                                Sign up
                            </Link>
                        </p>
                        {error && <p className="text-red-500">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
