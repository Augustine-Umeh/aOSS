import React from "react";
import "./ProductDetail.css";

const DetLoadingPage = () => {
    return (
        <div className="main-content det-loading-page">
            <div className="relative bg-white py-10 shadow-lg mt-10 mx-auto max-w-6xl rounded-md">
                <div className="relative px-4 sm:px-6 lg:px-4" style={{ width: 'calc(100% - 20%)', left: '5%' }}>
                    <div className="flex flex-col md:flex-row -mx-4">
                        <div className="md:flex-1 px-4">
                            <div className="h-96 rounded-lg bg-gray-300 mb-4 overflow-hidden">
                                {/* Placeholder image with loading animation */}
                                <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                            </div>
                            <div className="flex -mx-2 mb-4">
                                {/* Placeholder buttons with loading animation */}
                                <div className="w-1/2 px-2">
                                    <div className="w-full bg-gray-200 text-gray-100 py-2 px-4 rounded-full font-bold hover:bg-gray-300 transition duration-300 animate-pulse">
                                      .
                                    </div>
                                </div>
                                <div className="w-1/2 px-2">
                                    <div className="w-full bg-gray-200 text-gray-100 py-2 px-4 rounded-full font-bold hover:bg-gray-300 transition duration-300 animate-pulse">
                                       .
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="border-r border-gray-300 mx-4"></div> Grey vertical line */}
                        <div className="md:flex-1 px-4">
                            {/* Horizontal line */}
                            <div className="bg-gray-300 h-8 w-74 rounded-md mb-4"></div>
                            {/* Horizontal line */}
                            <div className="bg-gray-300 h-3 w-64 rounded-md mb-8"></div>
                            <div className="mb-4">
                                <span className="font-bold text-gray-700"></span>
                                <span className="text-gray-600"></span>
                            </div>
                            <div className="mb-4">
                                <p className='rate-text'></p>
                                {/* Placeholder for rating */}
                                <div className="rating">
                                    <span className="star animate-pulse">★</span>
                                    <span className="star animate-pulse">★</span>
                                    <span className="star animate-pulse">★</span>
                                    <span className="star animate-pulse">★</span>
                                    <span className="star animate-pulse">★</span>
                                </div>
                            </div>
                            {/* Additional content such as color and size selection could go here */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetLoadingPage;
