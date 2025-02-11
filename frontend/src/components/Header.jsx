import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { FaSearch, FaUser, FaSignInAlt, FaSignOutAlt, FaHome, FaStore, FaBars, FaTimes, FaBell } from "react-icons/fa";
import martImage from '../assets/Mart.png';

const Header = () => {
  const { authUser, logout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => setSearchQuery(e.target.value);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setIsSearchVisible(false);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSearch = () => setIsSearchVisible(!isSearchVisible);

  useEffect(() => {
    const closeMenu = (e) => {
      if (!e.target.closest("#menu-button") && !e.target.closest("#menu")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  return (
    <>
      <nav className="bg-brown-600 shadow-md">
        {/* Main Header */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section: Logo and Home */}
            <div className="flex items-center space-x-2">
              <img src={martImage} alt="Logo" className="h-10 w-10 rounded-full" />
              <NavLink 
                to="/" 
                className="text-white bg-brown-700 px-3 py-2 rounded flex items-center space-x-2 hover:bg-brown-800 transition-colors duration-200"
              >
                <FaHome className="text-lg" />
                <span className="hidden xs:inline">Home</span>
              </NavLink>
            </div>

            {/* Desktop Search */}
            <div className="md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full rounded-full px-4 py-2 text-black border border-gray-300 pr-10"
                />
                <FaSearch 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors duration-200" 
                  onClick={handleSearch} 
                />
              </div>
            </div>

            {/* Right Section: Mobile Search Toggle, Menu */}
            <div className="flex items-center space-x-2">
              {/* Desktop Navigation */}
              <ul className="hidden md:flex items-center space-x-4">
                {authUser ? (
                  <>
                    <li>
                      <NavLink to="/profile" className="px-3 py-2 rounded-md text-sm font-medium text-brown-100 hover:bg-brown-700 transition-colors duration-200 flex items-center space-x-2">
                        <FaUser />
                        <span>Profile</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/notification" className="px-3 py-2 rounded-md text-sm font-medium text-brown-100 hover:bg-brown-700 transition-colors duration-200 flex items-center space-x-2">
                        <FaBell />
                        <span>Notification</span>
                      </NavLink>
                    </li>
                    <li>
                      <button onClick={logout} className="px-3 py-2 rounded-md text-sm font-medium text-brown-100 hover:bg-brown-700 transition-colors duration-200 flex items-center space-x-2">
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <NavLink to="/login" className="px-3 py-2 rounded-md text-sm font-medium text-brown-100 hover:bg-brown-700 transition-colors duration-200 flex items-center space-x-2">
                        <FaSignInAlt />
                        <span>Sign in</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/signup" className="px-3 py-2 rounded-md text-sm font-medium text-brown-100 hover:bg-brown-700 transition-colors duration-200 flex items-center space-x-2">
                        <FaUser />
                        <span>Sign up</span>
                      </NavLink>
                    </li>
                  </>
                )}
                <li>
                  <NavLink to="/sell-page" className="px-3 py-2 rounded-md text-sm font-medium text-brown-100 hover:bg-brown-700 transition-colors duration-200 flex items-center space-x-2">
                    <FaStore />
                    <span>Sell</span>
                  </NavLink>
                </li>
              </ul>

              {/* Mobile Menu Button */}
              <button 
                id="menu-button" 
                onClick={toggleMenu} 
                className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-400 text-white hover:bg-brown-700 transition-colors duration-200"
              >
                {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${isSearchVisible ? 'max-h-16 py-2' : 'max-h-0'}`}>
          <div className="px-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full rounded-full px-4 py-2 text-black border border-gray-300 pr-10 focus:outline-none focus:ring-2 focus:ring-brown-400"
              />
              <FaSearch 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors duration-200" 
                onClick={handleSearch} 
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-[73px] bg-white border-t border-brown-800 shadow-lg z-50">
          <div className="p-2 space-y-2">
            {authUser ? (
              <>
                <NavLink 
                  to="/profile" 
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUser />
                  <span>Profile</span>
                </NavLink>
                <button 
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }} 
                  className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 rounded flex items-center space-x-2"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <FaSignInAlt />
                  <span>Sign in</span>
                </NavLink>
                <NavLink 
                  to="/signup" 
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUser />
                  <span>Sign up</span>
                </NavLink>
              </>
            )}
            <NavLink 
              to="/sell-page" 
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <FaStore />
              <span>Sell</span>
            </NavLink>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;