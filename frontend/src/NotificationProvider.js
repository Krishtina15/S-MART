import React, { useEffect, useState } from "react";
import socket from "./utils/socket";
import { useAuthContext } from "./context/AuthContext";
import notificationSound from "./assets/notification.mp3";
import axios from "axios";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { authUser } = useAuthContext();


    // Fetch notifications from the backend
    const fetchNotifications = async () => {
      if (authUser) {
        try {
          const response = await axios.get(`http://localhost:8000/api/notifications/${authUser._id}`);
          setNotifications(response.data.data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };
  
    useEffect(() => {
      if (authUser) {
        // Fetch notifications when the component mounts
        fetchNotifications();
  
        // Listen for new notifications via WebSocket
        socket.on("newNotification", (newNotification) => {
          setNotifications((prev) => [newNotification, ...prev]);
        });
      }
  
      // Cleanup on unmount
      return () => {
        socket.off("newNotification");
      };
    }, [authUser]);
  
    return (
      <NotificationContext.Provider value={{ notifications, setNotifications }}>
        {children}
      </NotificationContext.Provider>
    );
  };
  
  export const useNotifications = () => useContext(NotificationContext);