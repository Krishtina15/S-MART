import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PaymentDetails = () => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle payment submission
  };

  return (
    <div className="p-8 bg-brown-50 min-h-screen">
      <h1 className="text-2xl font-bold text-brown-800 mb-6">Payment Details</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Card Number"
          value={cardDetails.cardNumber}
          onChange={(e) =>
            setCardDetails({ ...cardDetails, cardNumber: e.target.value })
          }
          className="w-full p-2 border border-brown-600 rounded-lg"
        />
        <input
          type="text"
          placeholder="Expiry Date"
          value={cardDetails.expiryDate}
          onChange={(e) =>
            setCardDetails({ ...cardDetails, expiryDate: e.target.value })
          }
          className="w-full p-2 border border-brown-600 rounded-lg"
        />
        <input
          type="text"
          placeholder="CVV"
          value={cardDetails.cvv}
          onChange={(e) =>
            setCardDetails({ ...cardDetails, cvv: e.target.value })
          }
          className="w-full p-2 border border-brown-600 rounded-lg"
        />
        <button
          type="submit"
          className="py-2 px-4 bg-brown-600 text-white rounded-lg hover:bg-brown-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PaymentDetails;