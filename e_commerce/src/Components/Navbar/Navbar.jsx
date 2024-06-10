import React, { useEffect, useState, useCallback } from "react";
import "./Navbar.css";
import Jwt from "../../JsonWebToken/KeyGenerator";
import supabase from "../../SupabaseClient";
import logo from "../Assets/aOSS-logo.png";
import cart_icon from "../Assets/shopping-cart.png";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import SearchResultsList from "./SearchResultsList";
import { useLocation } from "react-router-dom";
import { useCart } from "../../CartContext"; // Import the useCart hook

const Navbar = () => {
    const location = useLocation();
    const { cartCounter, updateCartCounter } = useCart(); // Use cartCounter and updateCartCounter from context
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [resetInputFlag, setResetInputFlag] = useState(false);
    const [currRoute, setCurrRoute] = useState(""); // Initialize as empty string
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track authentication status

    useEffect(() => {
        setCurrRoute(location.pathname.split("/")[1]); // Update currRoute when location changes
    }, [location]); // dependency on location ensures update on route change

    // Event handlers for focus and blur
    const handleFocus = () => {
        setShowResults(true);
    };

    const handleBlur = () => {
        setTimeout(() => setShowResults(false), 150);
    };

    const resetInput = () => {
        setResults([]);
        setResetInputFlag(true);
    };

    // Check authentication status on component mount
    useEffect(() => {
        const token = localStorage.getItem("user_token");
        setIsLoggedIn(!!token); // Set isLoggedIn based on token existence
    }, []);

    // Reset the flag after it has been set
    useEffect(() => {
        if (resetInputFlag) {
            setResetInputFlag(false);
        }
    }, [resetInputFlag]);

    // const fetchCartItemsCount = async () => {
    //     try {
    //         const token = localStorage.getItem('user_token');
    //         if (!token) {
    //             return;
    //         }

    //         const decodedToken = await Jwt.decodeToken(token);
    //         const userId = decodedToken.userID;

    //         const { data: userData, error: fetchError } = await supabase
    //             .from('members')
    //             .select('cart_items')
    //             .eq('user_uuid', userId)
    //             .single();

    //         if (fetchError) throw fetchError;

    //         const cartItemsCount = userData.cart_items ? userData.cart_items.length : 0;
    //         updateCartCounter(cartItemsCount); // Update cart counter using context
    //     } catch (error) {
    //         console.error('Error fetching cart items count:', error.message);
    //     }
    // };

    // useEffect(() => {

    //     fetchCartItemsCount();
    // }, [isLoggedIn]);

    const fetchCartItemsCount = useCallback(async () => {
        try {
            const token = localStorage.getItem("user_token");
            if (!token) {
                return;
            }

            const decodedToken = await Jwt.decodeToken(token);
            const userId = decodedToken.userID;

            const { data: userData, error: fetchError } = await supabase
                .from("members")
                .select("cart_items")
                .eq("user_uuid", userId)
                .single();

            if (fetchError) throw fetchError;

            const cartItemsCount = userData.cart_items
                ? userData.cart_items.length
                : 0;
            updateCartCounter(cartItemsCount); // Update cart counter using context
        } catch (error) {
            console.error("Error fetching cart items count:", error.message);
        }
    }, [updateCartCounter]); // Add any dependencies fetchCartItemsCount relies on

    useEffect(() => {
        fetchCartItemsCount();
    }, [isLoggedIn, fetchCartItemsCount]);

    return (
        <div className="navbar-full">
            <div className="navbar-top">
                <a href="/#" className="nav-logo">
                    <img className="nav-logo-img" src={logo} alt="aOSS" />
                </a>
                <div className="nav-search-container">
                    <SearchBar
                        setResults={setResults}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        resetInputFlag={resetInputFlag}
                    />
                    {showResults && (
                        <SearchResultsList
                            results={results}
                            resetInput={resetInput}
                        />
                    )}
                </div>
                <div className="nav-login-cart">
                    {isLoggedIn ? (
                        <>
                            <Link to="/logout">
                                <button>Logout</button>
                            </Link>
                            <a href="/cart" onClick={fetchCartItemsCount}>
                                <img
                                    className="nav-cart-img"
                                    src={cart_icon}
                                    alt="Cart"
                                />
                            </a>
                            <div className="nav-cart-counter">
                                {cartCounter}
                            </div>
                        </>
                    ) : (
                        <a href="/login">
                            <button>Login</button>
                        </a>
                    )}
                </div>
            </div>
            <div className="navbar-bottom">
                <ul className="nav-menu">
                    {["", "men", "women", "kids"].map((section) => (
                        <li key={section}>
                            <Link
                                to={section ? `/${section}` : "/"}
                                style={{
                                    textDecoration: "none",
                                    color: "black",
                                }}
                            >
                                {section
                                    ? section.charAt(0).toUpperCase() +
                                      section.slice(1)
                                    : "Home"}
                            </Link>
                            {currRoute === section ? <hr /> : null}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
