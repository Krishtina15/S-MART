import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext'; // Import AuthContextProvider
import Layout from './Layout';
import ProductGrid from './components/ProductGrid';
import ProductDetails from './components/ProductDetails';
import SellPage from './components/SellPage';
import Profile from './components/Profile';
import About from './components/About';
import Login from './components/Login';
import Signup from './components/Signup';
import UpdateProduct from "./components/UpdateProduct";
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import ChatPage from './components/Chatpage.jsx';
import SearchedProducts from './components/SearchedProducts.jsx';

// Router setup
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
        path: 'product-details/:id',
        element: <ProductDetails />,
      },
      {
        path: 'sell-page',
        element: (
          <ProtectedRoute>
            <SellPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "update-product/:id",
        element: (
          <ProtectedRoute>
            <UpdateProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'chat' ,
        element:(
          <ProtectedRoute>
            <ChatPage/>
          </ProtectedRoute>
        )
      },
      {
        path: 'search' ,
        element:(
          <SearchedProducts/>
        )
      }
    ],
  },
]);

// Render the app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode>
);