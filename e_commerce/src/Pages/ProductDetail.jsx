import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import supabase from "../SupabaseClient";
import ProductCard from "../Components/ProductDisplay/ProductCard";
import DetLoadingPage from "./DetLoadingPage";

function ProductDetail() {
    const { prod_id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getProductDetails = async () => {
            try {
                const { data, error } = await supabase
                    .from("products")
                    .select(
                        "prod_name, prod_price, prod_description, prod_imgurl, prod_uuid, prod_category, stars, productURL"
                    )
                    .eq("prod_uuid", prod_id)
                    .single();

                if (error) {
                    throw error;
                }

                if (data) {
                    setProduct(data);
                    // Simulate loading for 2 seconds
                    setTimeout(() => {
                        
                        setLoading(false);
                    }, 500);
                }
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        getProductDetails();
    }, [prod_id]); // Ensure the effect runs again if prod_id changes

    return (
        <div >
            {loading ? (
                <DetLoadingPage />
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <div>
                    <ProductCard product={product} />
                </div>
            )}
        </div>
    );
}

export default ProductDetail;
