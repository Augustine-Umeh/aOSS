import React from 'react';
import ProductButton from './ProductButton';  // Ensure ProductButton is imported
import "./ProductContent.css";

const ProductGrid = ({ products }) => {
    // console.log(products)

    const getCategoryTitle = () => {
        if (products.length > 0) {
            const category = products[0].cat_name;  // Assuming all products in the list have the same category
            switch (category) {
                case 'Mens':
                    return 'Men Products';
                case 'Womens':
                    return 'Women Products';
                case 'Kids':
                    return 'Kids Products';
                default:
                    return 'Products';
            }
        }
        return 'Sorry Out of Stock';  // Default title if no products are available
    };

    return (
        <div className="text-center p-10">
            <h1 className="category-colour font-bold text-4xl mb-4">{getCategoryTitle()}</h1>
            <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
                {products.map(product => (
                    <ProductButton key={product.prod_id} product={product} />
                ))}
            </section>
        </div>
    );
};

export default ProductGrid;
