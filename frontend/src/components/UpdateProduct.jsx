import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State variables
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${id}`);
        if (response.data && response.data.data) {
          const product = response.data.data;
          setProductName(product.productName || "");
          setPrice(product.price || "");
          setDescription(product.description || "");
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/products/${id}`, {
        productName,
        price,
        description,
      });
      navigate(`/product-details/${id}`);
    } catch (error) {
      setError("Failed to update product");
    }
  };

  if (loading) return <p className="text-center text-lg text-brown-600">Loading...</p>;
  if (error) return <p className="text-center text-lg text-red-600">{error}</p>;

  return (
    <main className="min-h-screen flex items-center justify-center bg-brown-50 p-6">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-2xl font-bold text-brown-800 mb-6 text-center">Update Product</h2>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-brown-700 font-medium mb-1">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-4 py-2 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500"
              required
            />
          </div>

          <div>
            <label className="block text-brown-700 font-medium mb-1">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500"
              required
            />
          </div>

          <div>
            <label className="block text-brown-700 font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition"
          >
            Update Product
          </button>
        </form>
      </div>
    </main>
  );
};

export default UpdateProduct;
