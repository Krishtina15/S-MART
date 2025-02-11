import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "../context/AuthContext";
const ProtectedRoute = ({ children }) => {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!authUser) {
      alert("Please log in to use the feature.");
      setTimeout(() => {
        navigate('/login'); // Redirect to login page after a delay
      }, 500); // 2-second delay before redirecting
    }
  }, [authUser, navigate]);

  if (!authUser) {
    return null; // Don't render the SellPage until user is logged in
  }

  return children; // Render the protected component if authenticated
};

export default ProtectedRoute;