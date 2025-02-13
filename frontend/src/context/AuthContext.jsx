import { createContext, useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }
  return context;
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  //const navigate = useNavigate(); 

  // Logout function to clear user data
  const logout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
    localStorage.removeItem("user");  // Remove from localStorage
    setAuthUser(null);  // Reset the authUser state
    //navigate("/"); 
    }
  };

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
