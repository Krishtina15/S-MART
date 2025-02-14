import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext'; // Import useAuthContext

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setAuthUser } = useAuthContext(); // Use setAuthUser from AuthContext
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data)); // Save user data to localStorage
        setAuthUser(data); // Update authUser in context
        navigate('/'); // Redirect to home page
      } else {
        setError(data.message || 'Login failed'); // Display error message
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
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
            <h2 className="text-2xl font-bold text-center text-brown-800">Welcome Back</h2>
            <p className="text-sm text-brown-600">Please sign in to continue</p>
          </div>
          <div className="mt-6 space-y-4">
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-brown-400" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                className="w-full pl-10 pr-3 py-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-brown-600 text-white py-2 rounded-md hover:bg-brown-700 transition-colors duration-300"
            >
              Sign In
            </button>
            <p className="text-sm text-center text-brown-600 mt-4">
              Don't have an account?
              <a href="/signup" className="text-brown-800 hover:underline ml-1">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;