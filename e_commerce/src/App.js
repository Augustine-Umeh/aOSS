import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Cart from "./Pages/Cart";
import ShopCategory from "./Pages/ShopCategory";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ProductDetail from "./Pages/ProductDetail";
import Logout from "./Components/Logout/Logout";

function App() {
    return (
        <div>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route 
                        path="/" 
                        element={<Home />} 
                    />
                    <Route
                        path="/men"
                        element={<ShopCategory category="men" />}
                    />
                    <Route path="/men/:prod_id" element={<ProductDetail />} />
                    <Route
                        path="/women"
                        element={<ShopCategory category="women" />}
                    />
                    <Route
                        path="/women/:prod_id"
                        element={<ProductDetail />}
                    />
                    <Route
                        path="/kids"
                        element={<ShopCategory category="kids" />}
                    />
                    <Route 
                        path="/kids/:prod_id" 
                        element={<ProductDetail />} 
                    />
                    <Route 
                        path="/cart" 
                        element={<Cart />}
                    />
                    <Route 
                        path="/login" 
                        element={<Login />} 
                    />
                    <Route 
                        path="/signup" 
                        element={<Signup />} 
                    />
                    <Route 
                        path="/logout" 
                        element={<Logout />} 
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
