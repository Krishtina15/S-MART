import React, { useEffect, useState } from "react";
import socket from "./utils/socket";
import { useAuthContext } from "./context/AuthContext";
import notificationSound from "./assets/notification.mp3";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      // Join the user's room
      socket.emit("joinRoom", authUser._id);

      // Listen for new offers
      socket.on("newOffer", (data) => {
        const sound = new Audio(notificationSound);
        sound.play();
        setNotifications((prev) => [...prev, data]);
      });

      // Listen for accepted offers
      socket.on("offerAccepted", (data) => {
        const sound = new Audio(notificationSound);
        sound.play();
        setNotifications((prev) => [...prev, data]);
      });

      // Listen for rejected offers
      socket.on("offerRejected", (data) => {
        const sound = new Audio(notificationSound);
        sound.play();
        setNotifications((prev) => [...prev, data]);
      });
    }

    // Cleanup on unmount
    return () => {
      socket.off("newOffer");
      socket.off("offerAccepted");
      socket.off("offerRejected");
    };
  }, [authUser]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);