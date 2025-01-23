import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './Layout.jsx';
import ProductGrid from './components/ProductGrid.jsx';
import ProductDetails from './components/ProductDetails.jsx';
import SellPage from './components/SellPage.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Profile from './components/Profile.jsx';
import About from './components/About.jsx';
import Login from './components/Login.jsx';
// Corrected router setup
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <ProductGrid />,
      },
      {
        path: 'product-details', 
        element: <ProductDetails />,
      },
      {
        path: 'sell-page', 
        element: <SellPage />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'login',
        element: <Login/>
      }
    ],
  },
]);

// Rendering the app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
