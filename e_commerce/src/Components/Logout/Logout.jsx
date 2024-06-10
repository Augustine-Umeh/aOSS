import React, { useEffect } from "react";
import supabase from "../../SupabaseClient";
import Jwt from "../../JsonWebToken/KeyGenerator";
import "./Logout.css";

function Logout() {
    useEffect(() => {
        const handleLogout = async () => {
            try {
                const token = localStorage.getItem('user_token');

                if (!token) throw new Error("This token doesn't exist");

                const decodedToken = await Jwt.decodeToken(token);
                const userId = decodedToken.userID;

                const { error: signOutError } = await supabase.auth.signOut();
                
                if (signOutError) throw signOutError;

                localStorage.removeItem('user_token');

                const { error } = await supabase
                    .from("members")
                    .update({ isLoggedIn: false })
                    .eq("user_uuid", userId);

                if (error) throw error;

                // Set a timeout to wait for 2 seconds before redirecting to home page
                setTimeout(() => {
                    window.location.href = "/"; // Redirect to home page
                }, 2000);

            } catch (error) {
                alert("Error logging out: " + error.message);
                console.error(error.message);
            }
        };

        handleLogout();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center w-full">
            <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-4xl mb-20">
                <h1 className="message text-2xl font-bold text-center mb-4 mb-16 dark:text-gray-800">
                    Thank you for shopping with aOSS
                </h1>
            </div>
        </div>
    );
}

export default Logout;
