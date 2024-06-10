import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../SupabaseClient";
import "./Signup.css"

function Signup() {
    const [user_email, setEmail] = useState("");
    const [user_pwd, setPassword] = useState("");
    const [user_name, setName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState([]); // State to hold the error message
    const navigate = useNavigate();


    const handleSignup = async (event) => {
        event.preventDefault();

        // Validate password
        let errorMessages = []; // Initialize an array to collect errors

        if (user_pwd.length < 8) {
            errorMessages.push("Password must be at least 8 characters long");
        }
        if (!user_pwd.match(/[a-z]/) || !user_pwd.match(/[A-Z]/)) {
            errorMessages.push(
                "Password must contain both uppercase and lowercase letters"
            );
        }
        if (!user_pwd.match(/[\^$*.[\]{}()?\-"!@#%&/,><':;|_~`]/)) {
            errorMessages.push(
                "Password must contain at least one special character"
            );
        }

        if (errorMessages.length > 0) {
            setErrors(errorMessages); // Set the array of errors to state
            return; // Prevent form submission
        }

        setErrors([]); // Clear any previous errors

        try {
            const { data, error } = await supabase.auth.signUp({
                email: user_email,
                password: user_pwd,
                options: {
                    data: {
                        display_name: user_name,
                    },
                },
            });
            if (error) throw error;

            console.log("Sign up successful:", data);

            try {
                const {error} = await supabase
                    .from("members")
                    .insert([
                        {
                            user_uuid: data.user.id,
                            cart_items: [],
                        },
                    ]);
                
                if (error) throw error;
            } catch (error) {
                alert(error.message)
            }

            navigate("/login");


        } catch (error) {
            alert("This account exist");
            setErrors([
                "An error occurred while signing up. Please try again.",
            ]);
        }
    };

    return (
        <div className="main-content-signup min-h-screen flex items-center justify-center w-full">
            <div className="bg-white shadow-md rounded-lg px-28 py-11 max-w-md">
                <h1 className="message text-3xl font-bold text-center px-18 mb-4 dark:text-gray-800">
                    Shop at aOSS Today!
                </h1>
                {errors.length > 0 && (
                    <div className="text-red-500 text-xs text-center mb-4">
                        {errors.map((error, index) => (
                            <p key={index}>• {error}</p>
                        ))}
                    </div>
                )}
                <form onSubmit={handleSignup}>
                    <div className="mb-4">
                        <label
                            htmlFor="user_name"
                            className="block text-sm font-bold text-gray-700 dark:text-gray-500 mb-2"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="user_name"
                            className="shadow-sm text-base rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter Full Name"
                            required
                            value={user_name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="user_email"
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
                            value={user_email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-bold text-gray-700 mb-2"
                        >
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={user_pwd}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="shadow-sm text-base rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sign up
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Signup;
