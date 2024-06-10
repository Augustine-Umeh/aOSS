import React from 'react';

const CatLoadingPage = () => {
    return (
        <div className="text-center p-10 mb-8">
            <div className="animate-pulse">
                <div className="mb-8"></div>
                <div className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(index => (
                        <div key={index} className="w-80 h-96 bg-gray-200 rounded-md"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CatLoadingPage;
