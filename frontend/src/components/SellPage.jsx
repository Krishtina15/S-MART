import React, { useState } from "react";

export default function SellPage() {
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    description: "",
    details: [], // Initialize details as an empty array
    images: null,
  });

  // Handle input changes for productName, price, and description
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const filesArray = Array.from(e.target.files);

    const isValidFiles = filesArray.every(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
    );

    if (isValidFiles) {
      setFormData({ ...formData, images: filesArray });
    } else {
      alert("Please upload valid image files (up to 5MB each).");
    }
  };

  // Handle adding new details
  const handleAddDetail = () => {
    setFormData({
      ...formData,
      details: [...formData.details, { key: "", value: "" }],
    });
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

    if (!formData.productName || !formData.price || !formData.images) {
      alert("Product Name, Price, and Image are mandatory fields!");
      return;
    }

    const data = new FormData();
    data.append("productName", formData.productName);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("details", JSON.stringify(formData.details));
    
    /*formData.details.forEach((detail, index) => {
      data.append(`details[${index}][key]`, detail.key);
      data.append(`details[${index}][value]`, detail.value);
    });*/
  

    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((file) => {
        data.append("images", file);
      });
    } else {
      alert("Please select at least one image.");
      return; // Prevent form submission if no image is selected
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        alert("Product added successfully!");
        setFormData({
          productName: "",
          price: "",
          description: "",
          details: [], // Reset details to an empty array
          images: null,
        });
      } else {const errorData = await res.json();
        alert(`Failed to add product. ${errorData.message || "Unknown error."}`);
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
        <input type="file" onChange={handleImageChange} required multiple />
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
        {/* Use optional chaining to avoid undefined errors */}
        {formData.details?.map((detail, index) => (
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
