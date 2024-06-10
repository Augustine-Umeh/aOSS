import React from "react";
import {useState } from "react";
import supabase from "../../SupabaseClient";
import Jwt from "../../JsonWebToken/KeyGenerator";
import "./Login.css"

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const { data, error } =
                await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

            if (error) throw error;

            try {
                const { error } = await supabase
                    .from("members")
                    .update({ isLoggedIn: true })
                    .eq("user_uuid", data.user.id);

                if (error) throw error;
            } catch (error) {
                alert(error.message);
            }

            const generateToken = async () => {
                try {
                    const token = await Jwt.generateTokenWithExpiry({ userID: data.user.id }, '24h');
                    localStorage.setItem('user_token', token);
                } catch (error) {
                    console.error('Error generating token:', error);

                }
            };

            generateToken();
            window.location.href = "/cart";

        } catch (error) {
            alert("This account doesn't exist");
            console.error(error.message);
        }
    };

    return (
        <div className="main-content-login min-h-screen flex items-center justify-center w-full">
            <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-4xl mb-20">
                <h1 className="text-2xl font-bold text-center mb-4 mb-16 dark:text-gray-800">
                    Welcome Back!
                </h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-8">
                        <label
                            htmlFor="email"
                            className="block text-sm font-bold text-gray-700 dark:text-gray-500 mb-2"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="shadow-sm text-base rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-bold text-gray-700 dark:text-gray-500 mb-2"
                        >
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className="shadow-sm text-base rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-xs font-medium text-gray-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center flex-grow">
                            <input
                                type="checkbox"
                                id="remember"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:outline-none"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                            <label
                                htmlFor="remember"
                                className="ml-2 block text-sm text-gray-700 dark:text-gray-500"
                            >
                                Remember me
                            </label>
                        </div>
                        <a
                            href="/signup"
                            className="text-xs font-bold text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-8"
                        >
                            Create Account
                        </a>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Log in
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
