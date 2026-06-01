import React, { useState, useContext } from "react";
import { loginUser } from "../repository/userRepository";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({ username, password });

            await login(response.user, response.token);

            navigate("/");
        } catch {
            setError("Invalid credentials. Try again.");
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-400 p-3 sm:p-4 md:p-6">
            <form
                className="bg-white backdrop-blur-lg px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 rounded-2xl shadow-2xl max-w-md w-full flex flex-col gap-4 sm:gap-5"
                onSubmit={handleLogin}
            >
                <h2 className="text-center text-xl sm:text-2xl font-bold text-blue-900 mb-2">
                    Welcome Back 👋
                </h2>

                <div className="relative">
                    <input
                        type="text"
                        id="username"
                        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-blue-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label
                        htmlFor="username"
                        className="absolute text-sm text-blue-900 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                    >
                        Username
                    </label>
                </div>

                <div className="relative">
                    <input
                        type="password"
                        id="password"
                        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-blue-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label
                        htmlFor="password"
                        className="absolute text-sm text-blue-900 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                    >
                        Password
                    </label>
                </div>

                <button
                    type="submit"
                    className="mt-2 sm:mt-4 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-200 w-full text-base sm:text-lg"
                >
                    Login
                </button>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;
