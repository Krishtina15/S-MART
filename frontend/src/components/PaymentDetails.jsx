import React, { useState } from "react";

const PaymentDetails = () => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  return (
    <div className="p-8 bg-brown-50 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold text-brown-800 mb-6">Payment Details</h1>
      <form className="space-y-4 w-full max-w-md">
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
          placeholder="Expiry Date (MM/YY)"
          value={cardDetails.expiryDate}
          onChange={(e) =>
            setCardDetails({ ...cardDetails, expiryDate: e.target.value })
          }
          className="w-full p-2 border border-brown-600 rounded-lg"
        />
        <input
          type="password"
          placeholder="CVV"
          value={cardDetails.cvv}
          onChange={(e) =>
            setCardDetails({ ...cardDetails, cvv: e.target.value })
          }
          className="w-full p-2 border border-brown-600 rounded-lg"
        />
        <button
          type="button"
          className="py-2 px-4 bg-brown-600 text-white rounded-lg hover:bg-brown-700 w-full"
        >
          Proceed
        </button>
      </form>
    </div>
  );
};

export default PaymentDetails;
