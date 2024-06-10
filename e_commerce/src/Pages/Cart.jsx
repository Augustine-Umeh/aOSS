import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./Cart.css";
import CartLoadingPage from "./CartLoadingPage";
import supabase from "../SupabaseClient";
import Jwt from "../JsonWebToken/KeyGenerator";
import StarRating from './StarRating';
import { useCart } from "../../src/CartContext"; // Import the CartContext

const Cart = () => {
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [totals, setTotals] = useState({ subTotal: 0, tax: 0, total: 0 });
    const [firstName, setFirstName] = useState("");

    // Access cartCounter and updateCartCounter from the CartContext
    const { updateCartCounter } = useCart();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const token = localStorage.getItem('user_token');
                if (!token) throw new Error("Login required");

                const decodedToken = await Jwt.decodeToken(token);
                const userId = decodedToken.userID;

                const [{ data: userData, error: fetchError }, { data: productsData, error: productsError }] = await Promise.all([
                    supabase.from('members').select('cart_items').eq('user_uuid', userId).single(),
                    supabase.from('products')
                        .select('prod_name, prod_price, prod_imgurl, prod_uuid, prod_category, stars, productURL')
                        .in('prod_uuid', (await supabase.from('members').select('cart_items').eq('user_uuid', userId).single()).data.cart_items.map(item => item.product_uuid))
                ]);

                if (fetchError) throw fetchError;
                if (productsError) throw productsError;

                const cartItems = userData.cart_items || [];
                const itemsWithDetails = productsData.map(product => {
                    const cartItem = cartItems.find(item => item.product_uuid === product.prod_uuid);
                    return {
                        ...product,
                        quantity: cartItem.quantity || 1,
                    };
                });
                setCartItems(itemsWithDetails);

                const { data: { user } } = await supabase.auth.getUser();
                const [firstname] = user.user_metadata.display_name.split(" ");
                setFirstName(`${firstname}'s Cart`);

                setLoading(false);

            } catch (error) {
                console.error('Error fetching cart items:', error.message);
            }
        };

        fetchCartItems();
    }, []);

    const calculateTotals = useMemo(() => {
        const newSubTotal = cartItems.reduce((acc, item) => acc + parseFloat(item.prod_price) * item.quantity, 0);
        const newTax = newSubTotal * 0.13;
        const newTotal = newSubTotal + newTax;
        return { subTotal: newSubTotal, tax: newTax, total: newTotal };
    }, [cartItems]);

    useEffect(() => {
        setTotals(calculateTotals);
    }, [cartItems, calculateTotals]);

    const updateItemQuantity = useCallback((prod_uuid, newQuantity) => {
        setCartItems(currentItems =>
            currentItems.map(item =>
                item.prod_uuid === prod_uuid ? { ...item, quantity: newQuantity } : item
            )
        );
    }, []);

    const incrementQuantity = useCallback((prod_uuid) => {
        setCartItems(currentItems =>
            currentItems.map(item =>
                item.prod_uuid === prod_uuid ? { ...item, quantity: Math.min(item.quantity + 1, 12) } : item
            )
        );
    }, []);

    const decrementQuantity = useCallback((prod_uuid) => {
        setCartItems(currentItems =>
            currentItems.map(item =>
                item.prod_uuid === prod_uuid ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item
            )
        );
    }, []);

    const deleteCartItem = useCallback(async (prod_uuid) => {
        try {
            const token = localStorage.getItem('user_token');
            if (!token) throw new Error("Login required");

            const decodedToken = await Jwt.decodeToken(token);
            const userId = decodedToken.userID;

            const { data: userData, error: fetchError } = await supabase
                .from('members')
                .select('cart_items')
                .eq('user_uuid', userId)
                .single();

            if (fetchError) throw fetchError;

            const updatedCartItems = userData.cart_items.filter(item => item.product_uuid !== prod_uuid);

            const { error } = await supabase
                .from('members')
                .update({ cart_items: updatedCartItems })
                .eq('user_uuid', userId);

            if (error) throw error;

            setCartItems(currentItems => currentItems.filter(item => item.prod_uuid !== prod_uuid));

            // Update the cart counter using the context function
            updateCartCounter(updatedCartItems.length);
        } catch (error) {
            console.error('Error deleting item:', error.message);
        }
    }, [updateCartCounter]);

    return (
        <div className="main-content text-center p-10">
            <h1 className="cart-owner mb-10 text-center text-2xl font-bold">{firstName}</h1>
            {loading ? (
                <CartLoadingPage />
            ) : (
                <section className="mx-auto max-w-5xl justify-items-center justify-center px-6 grid grid-cols-1 lg:grid-cols-1 md:grid-cols-1 md:space-x-6 xl:px-0">
                    {cartItems.map(item => (
                        <div key={item.prod_uuid} className="rounded-lg md:w-2/3">
                            <div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
                                <a href={item.productURL} className="block w-full sm:w-40 relative group">
                                    <img
                                        src={item.prod_imgurl}
                                        alt={item.prod_name}
                                        className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-105 group-hover:blur-sm rounded-lg"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 bg-opacity-100">
                                        View on Amazon
                                    </div>
                                </a>
                                <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                                    <div className="mt-5 sm:mt-0">
                                        <h2 className="text-lg font-bold text-gray-900">
                                            {item.prod_name}
                                        </h2>
                                        <p className="mt-1 text-xs text-gray-700">
                                            {item.prod_category}
                                        </p>
                                        {/* Display the star rating */}
                                        {(
                                            <StarRating rating={item.stars} />
                                        )}
                                    </div>
                                    <div className="mt-4 flex flex-col sm:space-y-6 sm:mt-0 sm:block">
                                        <p className="text-sm mb-2">Quantity</p>
                                        <div className="flex items-center">
                                            <button
                                                className={`cursor-pointer rounded-l mb-4 py-1 px-3.5 duration-100 ${item.quantity === 1
                                                    ? "bg-gray-100 cursor-not-allowed"
                                                    : "bg-gray-300 hover:bg-blue-500 hover:text-blue-50"
                                                    }`}
                                                onClick={() => decrementQuantity(item.prod_uuid)}
                                                disabled={item.quantity === 1}
                                            >
                                                -
                                            </button>
                                            <input
                                                id={`quantity-${item.prod_uuid}`}
                                                name="quantity"
                                                className="h-8 w-8 border bg-white text-center mb-4 shadow-md text-xs outline-none"
                                                type="number"
                                                value={item.quantity}
                                                onChange={e => updateItemQuantity(item.prod_uuid, Math.min(12, Math.max(1, parseInt(e.target.value || 1))))}
                                                autoComplete="on"
                                            />
                                            <button
                                                className={`cursor-pointer rounded-r mb-4 py-1 px-3.5 ml-1 duration-100 ${item.quantity >= 12
                                                    ? "bg-gray-100"
                                                    : "bg-gray-300 hover:bg-blue-500 hover:text-blue-50"
                                                    }`}
                                                onClick={() => incrementQuantity(item.prod_uuid)}
                                                disabled={item.quantity >= 12}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="flex items-center space-x-4 mt-8">
                                            <p className="text-sm">${item.prod_price}</p>
                                            <button
                                                className="text-black-500 hover:text-orange-500"
                                                onClick={() => deleteCartItem(item.prod_uuid)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
                        <div className="mb-2 flex justify-between">
                            <p className="text-gray-700">Subtotal</p>
                            <p className="text-gray-700">${totals.subTotal.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-gray-700">Tax</p>
                            <p className="text-gray-700">${totals.tax.toFixed(2)}</p>
                        </div>
                        <hr className="my-4" />
                        <div className="flex justify-between">
                            <p className="text-lg font-bold">Total</p>
                            <p className="text-lg font-bold">${totals.total.toFixed(2)} USD</p>
                        </div>
                        <button className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">
                            Check out
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Cart;
