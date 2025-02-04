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
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import ChatPage from './components/Chatpage.jsx';

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