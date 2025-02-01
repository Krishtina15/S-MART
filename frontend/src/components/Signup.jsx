import React, { useState } from 'react';
import { User, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "../context/AuthContext"; // Adjust the path as needed

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { setAuthUser } = useAuthContext(); // Destructure setAuthUser from the context
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password, 
          confirmPassword,
        }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Debugging

      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.setItem("user", JSON.stringify(data));
      setAuthUser(data); // Update the auth user in the context

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
      setAuthUser(data); // Update the auth user in the context

        navigate('/');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup');
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
          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-brown-400" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
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
                className="w-full pl-10 pr-3 py-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
              />
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
                className="w-full pl-10 pr-3 py-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
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
                className="w-full pl-10 pr-3 py-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
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

export default Signup;