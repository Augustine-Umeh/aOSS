import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCounter, setCartCounter] = useState(0);

    const updateCartCounter = (newCount) => {
        setCartCounter(newCount);
    };

    return (
        <CartContext.Provider value={{ cartCounter, updateCartCounter }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
