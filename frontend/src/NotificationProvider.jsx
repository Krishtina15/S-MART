import React, { useEffect, useState, createContext, useContext } from "react";
import { useSocketContext } from "./context/SocketContext.jsx";
import { useAuthContext } from "./context/AuthContext.jsx";
import notificationSound from "./assets/notification.mp3";
import axios from "axios";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();
  // Fetch notifications from the backend
  const fetchNotifications = async () => {
    if (authUser) {
      try {
        const response = await axios.get(`http://localhost:8000/api/notifications/${authUser._id}`,{ withCredentials: true });
        setNotifications(response.data.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();

    if (authUser && socket ) {
      // Join the user's room
      console.log("Joining room for:", authUser._id);
      
      socket.emit("joinRoom", authUser._id);
      
      // Listen for new notifications
      const handleNewNotification = (newNotification) => {
        if (newNotification.userId === authUser._id) {
          setNotifications((prev) => [newNotification, ...prev]);
          const audio = new Audio(notificationSound);
          audio.play();
        }
      };

      socket.on("newNotification", handleNewNotification);

      // Cleanup on unmount
      return () => {
        socket.off("newNotification", handleNewNotification);
        socket.emit("leaveRoom", authUser._id);
      };
    } else {
      // Clear notifications if the user logs out
      setNotifications([]);
    }
  }, [authUser,socket]);

  // Function to clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);