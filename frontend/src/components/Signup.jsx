import React, { useState } from 'react';
import { User, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "../context/AuthContext"; // Adjust the path as needed

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }
    

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);
      formData.append('profilePicture', profilePicture);
    
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message  || "Signup failed.");
        setMessageType("error");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      setAuthUser(data);

      setMessage("Signup successful! Redirecting...");
      setMessageType("success");

      setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds

    } catch (error) {
      console.error("Signup error:", error);
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brown-50 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden border border-brown-200">
        <div className="px-6 py-8">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-brown-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-center text-brown-800">Create Account</h2>
            <p className="text-sm text-brown-600">Please sign up to get started</p>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div
              className={`mt-4 p-3 text-sm text-center rounded-md ${
                messageType === "success" ? "bg-green-100 text-green-700 border border-green-400" : 
                "bg-red-100 text-red-700 border border-red-400"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-brown-400" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-brown-400" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
              />
            </div>

            {/* Profile Picture Upload */}
            <div className="relative">
              <label className="block text-brown-900 mb-2">Profile Picture</label>
              <input
                type="file"
                name='profilePicture'
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setProfilePicture(file);
                  setProfilePicturePreview(URL.createObjectURL(file));
                }}
                className="w-full p-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
              />
              {profilePicturePreview && (
                <img
                  src={profilePicturePreview}
                  alt="Profile Preview"
                  className="mt-2 w-20 h-20 object-cover rounded-full"
                />
              )}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-brown-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-3 py-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-brown-400" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-3 py-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brown-600 text-white py-2 rounded-md hover:bg-brown-700 transition-colors duration-300"
            >
              Sign Up
            </button>

            <p className="text-sm text-center text-brown-600 mt-4">
              Already have an account?
              <a href="/login" className="text-brown-800 hover:underline ml-1">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
