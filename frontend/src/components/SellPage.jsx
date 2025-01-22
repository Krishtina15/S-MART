import React, { useState } from "react";

export default function SellPage() {
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    description: "",
    details: [],
    images: null,
  });

  // Handle input changes for productName, price, and description
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setFormData({ ...formData, images: e.target.files[0] });
  };

  // Handle adding new details
  const handleAddDetail = () => {
    setFormData({ ...formData, details: [...formData.details, { key: "", value: "" }] });
  };

  // Handle changes to individual detail fields
  const handleDetailChange = (index, field, value) => {
    const updatedDetails = [...formData.details];
    updatedDetails[index][field] = value;
    setFormData({ ...formData, details: updatedDetails });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if required fields are filled
    if (!formData.productName || !formData.price || !formData.images) {
      alert("Product Name, Price, and Image are mandatory fields!");
      return;
    }

    // Prepare form data for submission
    const data = new FormData();
    data.append("productName", formData.productName);
    data.append("price", formData.price);
    data.append("images", formData.images);
    data.append("description", formData.description);
    data.append("details", JSON.stringify(formData.details)); // Send details as JSON string

    try {
      const response = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        alert("Product added successfully!");
        setFormData({
          productName: "",
          price: "",
          description: "",
          details: [], 
          images: null,
        });
      } else {
        alert("Failed to add product.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Product Name:</label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="text"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Image:</label>
        <input type="file" onChange={handleImageChange} required />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
      </div>
      <div>
        <h3>Details:</h3>
        {formData.details.map((detail, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Key"
              value={detail.key}
              onChange={(e) =>
                handleDetailChange(index, "key", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Value"
              value={detail.value}
              onChange={(e) =>
                handleDetailChange(index, "value", e.target.value)
              }
            />
          </div>
        ))}
        <button type="button" onClick={handleAddDetail}>
          Add Detail
        </button>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

    
