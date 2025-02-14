import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const SearchedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalResults, setTotalResults] = useState(0);
    const location = useLocation();

    // Extract search query from URL
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("query") || "";

    useEffect(() => {
        if (searchQuery) {
            fetchSearchResults(searchQuery);
        }
    }, [searchQuery]);

    const fetchSearchResults = async (query) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/products/search?query=${query}`);
            setProducts(data.data);
            setTotalResults(data.totalResults);
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = (productId) => {
        console.log("Clicked product ID:", productId);
        // Add navigation logic if needed
    };

    return (
        <main className="py-8">
            <div className="flex justify-center items-center">
                <div className="max-w-screen-lg w-full">
                    <h1 className="text-2xl font-bold text-center mb-6">Product Gallery</h1>

                    {loading ? (
                        <p className="text-center text-gray-600">Loading...</p>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product._id} 
                                    className="shadow-lg transition-transform transform hover:scale-105 bg-white rounded-lg overflow-hidden"
                                >
                                    <img
                                        src={`http://localhost:8000/${product.images[0]}`} 
                                        alt={product.productName}
                                        className="w-full h-48 object-cover cursor-pointer"
                                        onClick={() => handleImageClick(product._id)}
                                    />
                                    <div className="p-4">
                                        <h2 className="text-lg font-semibold text-amber-900">{product.productName}</h2>
                                        <p className="text-xl font-bold text-amber-800">${product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-600">No products found.</p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default SearchedProducts;
