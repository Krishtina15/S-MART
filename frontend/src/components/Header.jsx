import React, { useState, useEffect } from "react"; // Add useState here
import { Link, NavLink } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext"; // Use the custom hook
import martImage from '../assets/Mart.png';
const Header = () => {
  const { authUser, logout } = useAuthContext(); // Get authUser and logout from context
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // Close the menu when clicking outside
  const closeMenu = (e) => {
    if (e.target.closest("#menu-button")) return; // If click is on the button, do nothing
    setIsOpen(false); // Close the menu otherwise
  };

  useEffect(() => {
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []); // Dependency array ensures this runs once on mount

  return (
    <nav className="bg-brown-600 flex items-center justify-between px-4 py-2 shadow-md">
      {/* Logo */}
      <img src={martImage} alt="Logo" width="50" className="rounded-full" />

      {/* Navigation */}
      <ul className="flex items-center space-x-4">
        {/* Search Input */}
        <li className="hidden md:block">
          <input
            type="text"
            placeholder="Search"
            className="rounded-full px-4 py-1 text-black"
          />
        </li>

        {/* Desktop Buttons */}
        <li className="md:block">
          <Link to="/" className="text-white hover:underline">Home</Link>
        </li>

        {authUser ? (
          // If user is logged in, show "Profile" and "Logout"
          <>
            <li className="md:block">
              <Link to="/profile" className="text-white hover:underline">Profile</Link>
            </li>
            <li className="md:block">
              <button
                onClick={logout}
                className="text-white hover:underline"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          // If user is not logged in, show "Sign in" and "Sign up"
          <>
            <li className="hidden md:block">
              <Link to="/login" className="text-white hover:underline">Sign in</Link>
            </li>
            <li className="hidden md:block">
              <Link to="/signup" className="text-white hover:underline">Sign up</Link>
            </li>
          </>
        )}

        <li className="hidden md:block">
          <NavLink to="/sell-page" className="text-white hover:underline">Sell</NavLink>
        </li>

        {/* Mobile Dropdown Button */}
        <li className="block md:hidden relative">
          <button
            id="menu-button"
            aria-expanded={isOpen} // Accessibility
            className="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={toggleMenu} // Toggle the menu
          >
            {/* Hamburger Icon */}
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-brown-800 rounded-lg shadow-lg z-10">
              {authUser ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-brown-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="block px-4 py-2 text-gray-800 hover:bg-brown-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="block px-4 py-2 text-gray-800 hover:bg-brown-100"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 text-gray-800 hover:bg-brown-100"
                  >
                    Sign up
                  </Link>
                </>
              )}
              <NavLink
                to="/sell-page"
                className="block px-4 py-2 text-gray-800 hover:bg-brown-100"
              >
                Sell
              </NavLink>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Header;
