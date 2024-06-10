import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client
const supabase = createClient(
  "https://clcsprfkhzdudhridugt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsY3NwcmZraHpkdWRocmlkdWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUxMjU4NjMsImV4cCI6MjAzMDcwMTg2M30.xF9G10iXxlbuaqzuEr4R0IQIm4v9B_OMtUo66Ph4cAw"
);

function GroupedCategories() {
  const [categories, setCategories] = useState({ Men: [], Women: [], Baby: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
        const { data, error } = await supabase
            .from("products")
            .select("prod_category")
            .distinct();

        if (error) {
            throw error;
        }

        if (data) {
            // console.log(data);
            const grouped = data.reduce((acc, item) => {
                const category = item.prod_category;

                if (category.includes("Men")) acc.Men.push(category);
                else if (category.includes("Women")) acc.Women.push(category);
                else if (category.includes("Baby")) acc.Baby.push(category);
                
                return acc;
            }, { Men: [], Women: [], Baby: [] });
            setCategories(grouped);
        }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
  };

    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error}</p>;

    return (
        <div>
        <h1>Grouped Product Categories</h1>
        <div>
            <h2>Men</h2>
            <ul>
            {categories.Men.map((category, index) => <li key={index}>{category}</li>)}
            </ul>
        </div>
        <div>
            <h2>Women</h2>
            <ul>
            {categories.Women.map((category, index) => <li key={index}>{category}</li>)}
            </ul>
        </div>
        <div>
            <h2>Baby</h2>
            <ul>
            {categories.Baby.map((category, index) => <li key={index}>{category}</li>)}
            </ul>
        </div>
        </div>
    );
}

export default GroupedCategories;
