import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Initialize states with empty values to avoid "undefined" issues
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
          setProductName(product.productName || ""); // Set default value
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Update Product</h2>
      <form onSubmit={handleUpdate}>
        <label className="block mb-2">Product Name:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2">Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2">Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
