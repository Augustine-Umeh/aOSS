import React, { useEffect, useState } from "react";
import ProductGrid from './ProductGrid';  // Ensure ProductGrid is imported
import supabase from "../../SupabaseClient";
import CatLoadingPage from "./CatLoadingPage"
import "./ProductContent.css";

const Men = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [inputPage, setInputPage] = useState(1);  // New state for the input
    const [totalProducts, setTotalProducts] = useState(0);
    const pageSize = 80; // Fixed pageSize for consistent results

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const min = (currentPage - 1) * pageSize;
            const max = currentPage * pageSize - 1;

            try {
                const { data, error: fetchError, count } = await supabase
                    .from("products")
                    .select("prod_id, prod_uuid, prod_name, prod_price, prod_imgurl, cat_name, prod_category", { count: 'exact' })
                    .eq("cat_name", "Mens")
                    .range(min, max);

                if (fetchError) throw fetchError;

                if (data) {
                    setProducts(data);
                    setTotalProducts(count);
                    setTimeout(() => {

                        setLoading(false);
                    }, 500);
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage]); // Dependency on currentPage

    const handleNextPage = () => {
        if (currentPage < Math.ceil(totalProducts / pageSize)) {
            setCurrentPage((prevPage) => prevPage + 1);
            setInputPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
            setInputPage((prevPage) => prevPage - 1);
        }
    };

    const handlePageInput = (e) => {
        const newPage = parseInt(e.target.value);
        if (!isNaN(newPage) && newPage >= 1 && newPage <= Math.ceil(totalProducts / pageSize)) {
            setInputPage(newPage);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            const newPage = parseInt(e.target.value);
            if (newPage >= 1 && newPage <= Math.ceil(totalProducts / pageSize)) {
                setCurrentPage(newPage);
            } else {
                setInputPage(currentPage);  // Reset input if out of bounds
            }
        }
    };

    const totalPages = Math.ceil(totalProducts / pageSize);

    return (
        <div className="main-content-cat">
            {loading ? (
                <CatLoadingPage />
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    <ProductGrid products={products} />
                    <div className="flex justify-center items-center space-x-4 mt-4">
                        <button
                            className={`text-white font-bold py-2 px-4 rounded ${currentPage === 1 ? 'bg-blue-200 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        >
                            Previous Page
                        </button>
                        <input
                            type="text"
                            value={inputPage}
                            onChange={handlePageInput}
                            onKeyDown={handleKeyDown}
                            className="text-center w-16 shadow-md"
                            min="1"
                            max={totalPages}
                        />
                        <span className="w-16">/ {totalPages}</span>
                        <button
                            className={`text-white font-bold py-2 px-4 rounded ${currentPage >= totalPages ? 'bg-blue-200 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
                            onClick={handleNextPage}
                            disabled={currentPage >= totalPages}
                        >
                            Next Page
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Men;
