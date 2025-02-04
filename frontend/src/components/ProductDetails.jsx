import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext"; // Import useAuthContext

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { authUser } = useAuthContext(); // Get the authenticated user

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${id}`);
        if (response.data && response.data.data) {
          setProduct(response.data.data);
        } else {
          setError("Product not found");
        }
      } catch (error) {
        setError("Unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return <p className="text-center text-lg text-brown-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-600">{error}</p>;
  }

  if (!product) {
    return <p className="text-center text-lg text-brown-600">Product not found</p>;
  }

  return (
    <main className="p-8 bg-brown-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Grid layout for image and details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Image Slider */}
          <div className="relative rounded-lg overflow-hidden shadow-xl flex items-center">
            <img
              className="w-full h-auto max-h-[500px] object-cover transition-transform duration-300 hover:scale-105"
              src={`http://localhost:8000/${product.images[currentImageIndex]}`}
              alt={`${product.productName} - Image ${currentImageIndex + 1}`}
            />

            {/* Navigation buttons */}
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-3 transform -translate-y-1/2 text-white bg-brown-800/60 p-3 rounded-full hover:bg-brown-900/70 transition"
            >
              &lt;
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white bg-brown-800/60 p-3 rounded-full hover:bg-brown-900/70 transition"
            >
              &gt;
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-brown-800/70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {product.images.length}
            </div>
          </div>

          {/* Price and Actions */}
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col space-y-6">
            <h1 className="text-3xl font-bold text-brown-800">{product.productName}</h1>
            <div className="text-2xl font-semibold text-brown-600">${product.price}</div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-4">
              <button className="w-full py-3 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition">
                Make Offer
              </button>
              <button className="w-full py-3 bg-brown-200 text-brown-800 rounded-lg hover:bg-brown-300 transition">
                Chat with Seller
              </button>
              {/* Conditionally render the Update button */}
              {authUser && authUser._id === product.userId && (
                <Link
                  to={`/update-product/${product._id}`}
                  className="block text-center w-full py-3 border border-brown-300 text-brown-700 rounded-lg hover:bg-brown-100 transition"
                >
                  Update Product
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <section className="bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-brown-800 mb-6">Product Details</h2>

          {/* Product Details Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 bg-brown-100 text-brown-800">Key</th>
                  <th className="text-left p-3 bg-brown-100 text-brown-800">Value</th>
                </tr>
              </thead>
              <tbody>
                {product.details.map((detail, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3 text-brown-600">{detail.key}</td>
                    <td className="p-3 text-brown-600">{detail.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Product Description */}
          <div className="text-brown-600">
            <h3 className="text-xl font-semibold mb-4 text-brown-800">Description</h3>
            <p className="text-base leading-relaxed">{product.description}</p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;
