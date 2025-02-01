import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';


const ProductDetails = () => {
    const { id } = useParams();
    console.log("Product ID from useParams:", id);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                console.log(`Fetching product with ID: ${id}`);
                const response = await axios.get(`/api/products/${id}`);
                console.log("API Response:", response.data);
                
                if (response.data && response.data.data) {
                    setProduct(response.data.data);
                } else {
                    setError("Product not found");
                }
            } catch (error) {
                console.error("Error fetching product:", error.response?.data || error.message);
                setError("Unexpected error occurred");
            } finally {
                setLoading(false);
            }
        };
        
    
        fetchProduct();
    }, [id]);
    
    if (loading) {
        return <p>Loading...</p>;  // Show loading message while fetching data
    }

    if (error) {
        return <p>{error}</p>;  // Show error message if there's an issue
    }

    if (!product) {
        return <p>Product not found</p>; // Handle case when product is null
      }

    return (
        <main>
            {/* Product Image */}
            <div className="flex justify-center items-center border-solid border-2 m-5">
                <div className="sm:columns-2 columns-1 mt-20 mb-16 max-w-screen-xl">
                    <div className="flex justify-center items-center">
                        <img
                            className="border-solid border-2 shadow-xl w-4/6"
                            src={`http://localhost:8000/${product.images[0]}`}
                            alt={product.productName}
                        />
                    </div>

                    {/* Price and Actions */}
                    <div className="mt-7 flex justify-center items-center">
                        <div className="break-inside-avoid">
                            <div className="border-solid border-2">
                                <div className="border-solid rounded-lg border-2 pt-2 mx-5 mt-7 mb-16">
                                    <div className="flex justify-center mb-9">
                                        <div className="max-w-max bg-brown-200 py-2 px-10 mt-7 rounded-lg">
                                            <h1>Price: ${product.price}</h1>
                                        </div>
                                    </div>
                                    <div className="flex justify-center mb-9">
                                        <div className="max-w-max bg-brown-200 py-2 px-10 rounded-lg">
                                            <button>Make Offer</button>
                                        </div>
                                    </div>
                                </div>
                                {/* Chat with Seller */}
                                <div className="border-solid border-2 rounded-lg flex justify-center items-center mx-5 mb-5">
                                    <div className="max-w-max bg-brown-200 py-2 px-12 rounded-lg">
                                        <button>Chat with Seller</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Details */}
            <section>
                <div className="border-solid border-2 flex justify-center items-center m-5">
                    <div className="max-w-screen-xl">
                        <div className="flex justify-center mt-5 font-extrabold text-xl">
                            <h1>Details</h1>
                        </div>
                        <div className="m-11 border-solid border-2 p-1">
                            {product.details.map((detail, index) => (
                                <div key={index} className="grid grid-cols-2 gap-4 m-6">
                                    <span>{detail.key}</span>
                                    <span>{detail.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center mt-5 font-extrabold text-xl">
                            <h1>Description</h1>
                        </div>
                        <div className="p-5">
                            <p>{product.description}</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ProductDetails;
