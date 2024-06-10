import React from "react";
import "./SearchResult.css";
import { useNavigate } from 'react-router-dom';

const SearchResult = ({ result, resetInput }) => {

    const navigate = useNavigate();

    const getCategoryNameSearch = (catName) => {
        switch (catName) {
            case 'Mens':
                return 'Men';
            case 'Womens':
                return 'Women';
            default:
                return 'Kids';
        }
    };

    const handleClick = (e) => {
        // e.preventDefault(); // Prevent the default anchor behavior
        navigate(`/${getCategoryNameSearch(result.cat_name).toLowerCase()}/${result.prod_uuid}`);
        resetInput();  // Reset the search input when a result is clicked
    };

    return (
        <div className="search-result">
            <a 
                href={`/${getCategoryNameSearch(result.cat_name).toLowerCase()}/${result.prod_uuid}`}
                onClick={handleClick}
                className="search-result-link"
            >
                {result.prod_name}
            </a>
        </div>
    );
};

export default SearchResult;
