import React, { useEffect, useState } from 'react';
import supabase from "../../SupabaseClient";
import Jwt from "../../JsonWebToken/KeyGenerator";
import './ProdCardStarRating.css';
import { useCart } from "../../CartContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
    const [isAdded, setIsAdded] = useState(false);
    const [rating, setRating] = useState(0);
    const { updateCartCounter } = useCart();

    const checkIfProductInCart = async (token, prodUuid) => {
        try {
            const decodedToken = await Jwt.decodeToken(token);
            const userId = decodedToken.userID;

            const { data: userData, error: fetchError } = await supabase
                .from('members')
                .select('cart_items')
                .eq('user_uuid', userId)
                .single();

            if (fetchError) throw fetchError;

            const currentCartItems = userData.cart_items || [];
            return currentCartItems.some(item => item.product_uuid === prodUuid);
        } catch (error) {
            console.error('Error checking product in cart:', error.message);
            return false;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('user_token');
        if (token) {
            checkIfProductInCart(token, product.prod_uuid).then(isAlreadyInCart => {
                if (isAlreadyInCart) {
                    setIsAdded(true);
                }
            });
        }
    }, [product.prod_uuid]);

    const handleButtonClick = async () => {
        try {
            const token = localStorage.getItem('user_token');
            if (!token) {
                alert("Login to add products to Cart");
                return;
            }

            const isAlreadyInCart = await checkIfProductInCart(token, product.prod_uuid);
            if (isAlreadyInCart) {
                setIsAdded(true);
                return;
            }

            const decodedToken = await Jwt.decodeToken(token);
            const userId = decodedToken.userID;

            const { data: userData, error: fetchError } = await supabase
                .from('members')
                .select('cart_items')
                .eq('user_uuid', userId)
                .single();

            if (fetchError) throw fetchError;

            const currentCartItems = userData.cart_items || [];
            const updatedCartItems = [...currentCartItems, { product_uuid: product.prod_uuid }];

            const { data, error } = await supabase
                .from('members')
                .update({ cart_items: updatedCartItems })
                .eq('user_uuid', userId);

            if (error) throw error;

            console.log('Product appended to cart successfully:', data);
            setIsAdded(true);

            // Fetch updated cart count and update context
            const updatedCartCount = updatedCartItems.length;
            updateCartCounter(updatedCartCount);

        } catch (error) {
            console.error('Error appending product to cart:', error.message);
        }
    };

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const token = localStorage.getItem('user_token');
                if (token) {
                    const decodedToken = await Jwt.decodeToken(token);
                    const userId = decodedToken.userID;

                    const { data, error } = await supabase
                        .from('members')
                        .select('members_ratings')
                        .eq('user_uuid', userId)
                        .single();

                    if (error) throw error;

                    // Extract rating for the specific product
                    const prod_rating = data?.members_ratings?.find(item => item.product_uuid === product.prod_uuid)?.rating || 0;

                    // Set the rating in the component's state
                    setRating(prod_rating);
                }

            } catch (error) {
                console.error('Error fetching rating:', error.message);
            }
        };

        fetchRating();
    }, [product.prod_uuid]);

    const handleRatingChange = async (newRating) => {
        try {
            const token = localStorage.getItem('user_token');
            if (!token) {
                alert("Login to rate products");
                return;
            }

            const decodedToken = await Jwt.decodeToken(token);
            const userId = decodedToken.userID;

            // Fetch the user's ratings
            const { data: userData, error: fetchError } = await supabase
                .from('members')
                .select('members_ratings')
                .eq('user_uuid', userId)
                .single();

            if (fetchError) throw fetchError;

            // Extract ratings from userData, if not present initialize as empty array
            const prod_ratings = userData.members_ratings || [];

            // Check if the product's rating is already present
            const existingIndex = prod_ratings.findIndex(item => item.product_uuid === product.prod_uuid);

            if (existingIndex !== -1) {
                // If the product's rating is present, update it
                prod_ratings[existingIndex].rating = newRating;
            } else {
                // If the product's rating is not present, add a new entry
                prod_ratings.push({ product_uuid: product.prod_uuid, rating: newRating });
            }

            // Update the ratings in the database
            const { data: updateData, error: updateError } = await supabase
                .from('members')
                .update({ members_ratings: prod_ratings })
                .eq('user_uuid', userId);

            if (updateError) throw updateError;

            console.log('Rating updated successfully:', updateData);

            // Update the local state with the new rating
            setRating(newRating);
        } catch (error) {
            console.error('Error updating rating:', error.message);
        }
    };

    return (
        <div
            className="main-content-card relative bg-white py-10 shadow-lg mt-10 mx-auto max-w-6xl rounded-md"
            style={{ boxShadow: '0 -4px 8px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)' }}
        >
            <div className="relative px-4 sm:px-6 lg:px-4" style={{ width: 'calc(100% - 20%)', left: '5%' }}>
                <div className="flex flex-col md:flex-row -mx-4">
                    <div className="md:flex-1 px-4">
                        <div className="h-96 rounded-lg bg-gray-300 mb-4 overflow-hidden relative">
                            <a href={product.productURL} className="block w-full h-full relative">
                                <img
                                    className="w-full h-full object-cover transition duration-300 ease-in-out hover:blur-sm"
                                    src={product.prod_imgurl}
                                    alt={product.prod_name}
                                />
                                <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold opacity-0 transition duration-300 ease-in-out hover:opacity-100 bg-black bg-opacity-50">
                                    Click to view on Amazon store
                                </div>
                            </a>
                        </div>
                        <div className="flex -mx-2 mb-4">
                            <div className="w-1/2 px-2">
                                <button
                                    className={`w-full text-white py-2 px-4 rounded-full font-bold transition duration-300 ${isAdded ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                    onClick={handleButtonClick}
                                    disabled={isAdded}
                                >
                                    {isAdded ? 'Added to Cart' : 'Add to Cart'}
                                </button>
                            </div>
                            <div className="w-1/2 px-2">
                                <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-full font-bold hover:bg-gray-300 transition duration-300">
                                    Add to Wishlist
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="border-r border-gray-300 mx-4"></div> {/* Grey vertical line */}
                    <div className="md:flex-1 px-4">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">{product.prod_name}</h2>
                        <p className="text-gray-600 text-sm mb-6">{product.prod_description}</p>
                        <div className="mb-4">
                            <span className="font-bold text-gray-700">Price: </span>
                            <span className="text-gray-600">${product.prod_price}</span>
                        </div>
                        <div className="mb-4">
                            <p className='rate-text'>Rate this Product</p>
                            <div className="rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`star ${rating >= star ? 'full' : 'empty'}`}
                                        onClick={() => handleRatingChange(star)}
                                        role="button"
                                        aria-label={`${star} stars`}>
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>
                        {/* Additional content such as color and size selection could go here */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
