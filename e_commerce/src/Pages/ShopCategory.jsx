import React from "react";
import Men from "../Components/Category/Men";
import Women from "../Components/Category/Women";
import Kids from "../Components/Category/Kid";

const ShopCategory = ({ category }) => {
    const CategoryComponent = () => {
        switch (category) {
            case "men":
                return <Men />;
            case "women":
                return <Women />;
            case "kids":
                return <Kids />;
            default:
                return <div>No category found</div>;  // Default message or component
        }
    };

    return (
        <div>
            {CategoryComponent()}
            {/* <Outlet />  // This is where nested routes will be rendered */}
        </div>
    );
};

export default ShopCategory;
