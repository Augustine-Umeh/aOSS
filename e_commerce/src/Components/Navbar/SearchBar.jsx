import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import supabase from "../../SupabaseClient";

const SearchBar = ({ setResults, onFocus, onBlur, resetInputFlag }) => {
    const [input, setInput] = useState("");

    const fetchData = async (value) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('prod_name, prod_id, prod_uuid, cat_name');

            if (error) {
                throw error;
            }

            if (data) {
                // Filter results based on search input
                const filteredData = data.filter((product) =>
                    product.prod_name.toLowerCase().includes(value.toLowerCase())
                );
                setResults(filteredData);
            }
        } catch (error) {
            console.error('Error fetching products:', error.message);
        }
    };

    const handleChange = (value) => {
        setInput(value);

        if (value.trim() !== "") fetchData(value);
        else setResults([]); // Hide results if input is empty

    };

    useEffect(() => {
        if (resetInputFlag) setInput(""); // reset input when external flag is triggered
    }, [resetInputFlag]);

    return (
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input
                id="search-product"
                name="searchProduct"
                placeholder="Search for a product"
                value={input}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
                autoComplete="on" // Optionally add autoComplete attribute
            />

        </div>
    );
};

export default SearchBar;
