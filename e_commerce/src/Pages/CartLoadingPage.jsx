import React from "react";
import "./Cart.css";

const CartLoadingPage = () => {
    return (
        <div className="cart-loading-page">
            <section className="mx-auto max-w-5xl justify-items-center justify-center gap-6 px-6 grid grid-cols-1 lg:grid-cols-1 md:grid-cols-1 md:space-x-6 xl:px-0">
                {[1, 2, 3].map(key => (
                    <div key={key} className="rounded-lg md:w-2/3">
                        <div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start" style={{ width: '650.99px', height: '236px' }}>
                            <div className="w-full rounded-lg sm:w-40 bg-gray-200 animate-pulse"></div>
                            <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                                <div className="mt-5 sm:mt-0">
                                    <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                    <div className="mt-1 h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                                </div>
                                <div className="mt-4 flex flex-col sm:space-y-6 sm:mt-0 sm:block">
                                    <div className="text-sm mb-2 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                    <div className="flex items-center space-x-4 mt-8">
                                        <div className="text-sm h-4 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default CartLoadingPage;
