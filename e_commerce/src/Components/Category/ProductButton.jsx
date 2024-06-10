import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import supabase from "../../SupabaseClient";
import Jwt from "../../JsonWebToken/KeyGenerator";
import { useCart } from "../../CartContext"; // Import the useCart hook

const ProductButton = ({ product }) => {
    const { updateCartCounter } = useCart(); // Use updateCartCounter from context
    const [isAdded, setIsAdded] = useState(false);

    const getCategoryNameButton = (catName) => {
        switch (catName) {
            case 'Mens':
                return 'Men';
            case 'Womens':
                return 'Women';
            default:
                return 'Kids';
        }
    };

    const checkIfProductInCart = async (token, prodUuid, isMounted) => {
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
            return isMounted ? currentCartItems.some(item => item.product_uuid === prodUuid) : false;
        } catch (error) {
            console.error('Error checking product in cart:', error.message);
            return false;
        }
    };

    useEffect(() => {
        let isMounted = true;
        const token = localStorage.getItem('user_token');
        if (token) {
            checkIfProductInCart(token, product.prod_uuid, isMounted).then(isAlreadyInCart => {
                if (isAlreadyInCart && isMounted) {
                    setIsAdded(true);
                }
            });
        }
        return () => {
            isMounted = false;
        };
    }, [product.prod_uuid]);

    const handleButtonClick = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        try {
            const token = localStorage.getItem('user_token');
            if (!token) {
                alert("Login to add products to Cart");
                return;
            }

            const isAlreadyInCart = await checkIfProductInCart(token, product.prod_uuid, true);
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

    return (
        <div className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
            <a href={`/${getCategoryNameButton(product.cat_name).toLowerCase()}/${product.prod_uuid}`}>
                <img src={product.prod_imgurl} alt={product.prod_name} className="h-80 w-72 object-cover rounded-t-xl" />
                <div className="px-4 py-3">
                    <p className="text-lg font-bold text-black truncate capitalize">{product.prod_name}</p>
                </div>
                <div className="flex justify-between items-center px-4 py-3">
                    <p className="text-lg font-semibold text-black cursor-auto">${product.prod_price.toFixed(2)}</p>
                    <button
                        className="text-black-900 hover:text-orange-500"
                        onClick={handleButtonClick}
                        disabled={isAdded}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={`bi shadow-md bi-bag-plus ${isAdded ? "text-gray-300 cursor-not-allowed" : ""}`} viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z" />
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                        </svg>
                    </button>
                </div>
            </a>
        </div>
    );
};

export default ProductButton;
