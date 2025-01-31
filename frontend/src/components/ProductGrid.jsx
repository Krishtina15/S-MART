import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the navigate function

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate(); // Initialize the navigate function

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('/api/products'); // Update with your API endpoint
                setProducts(data.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        

        fetchProducts();
    }, []);

    const handleImageClick = (productId) => {
        navigate(`/product-details/${productId}`); // Navigate to the product details page with the ID
    };

    return (
        <main className="py-8">
            <div className="flex justify-center items-center">
                <div className="max-w-screen-lg w-full">
                    <h1 className="text-2xl font-bold text-center mb-6">Product Gallery</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product._id} // Use product._id as the unique key
                                className="shadow-lg transition-transform transform hover:scale-105 bg-white rounded-lg overflow-hidden"
                            >
                                <img
                                    src={`http://localhost:8000/${product.images[0]}`} // Display the first image
                                    alt={product.productName}
                                    className="w-full h-48 object-cover cursor-pointer"
                                    onClick={() => handleImageClick(product._id)} // Pass the product ID to the handler
                                />
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold text-amber-900">{product.productName}</h2>
                                    <p className="text-xl font-bold text-amber-800">${product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductGrid;
