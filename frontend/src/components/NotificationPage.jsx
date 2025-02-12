import React, { useEffect } from "react";
import { useNotifications } from "../NotificationProvider.jsx";
import axios from "axios";

const NotificationPage = () => {
  const { notifications, setNotifications } = useNotifications();

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:8000/api/notifications/${notificationId}/read`, { withCredentials: true });
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    // Mark all notifications as read when the page loads
    notifications.forEach((notification) => {
      if (!notification.read) {
        markAsRead(notification._id);
      }
    });
  }, [notifications]);

  return (
    <div className="p-8 bg-brown-50 min-h-screen">
      <h1 className="text-2xl font-bold text-brown-800 mb-6">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className={`p-4 bg-white rounded-lg shadow-md text-brown-600 ${
              notification.read ? "opacity-75" : ""
            }`}
          >
            <p>{notification.message}</p>
            {notification.type === "offerAccepted" && (
              <button
                onClick={() => {
                  // Redirect to payment details page
                  window.location.href = `\payment`;
                }}
                className="mt-2 inline-block py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Provide Card Details
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;