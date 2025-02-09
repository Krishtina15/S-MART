import React, { useEffect } from "react";
import { useNotifications } from "../context/NotificationContext";

const NotificationPage = () => {
  const { notifications, clearNotifications } = useNotifications();

  useEffect(() => {
    // This effect will run whenever the notifications array changes
    // You can add any additional logic here if needed
  }, [notifications]);

  return (
    <div className="p-8 bg-brown-50 min-h-screen">
      <h1 className="text-2xl font-bold text-brown-800 mb-6">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg shadow-md text-brown-600"
          >
            <p>{notification.message}</p>
            {notification.offer?.status === "accepted" && (
              <button
                onClick={() => {
                  // Redirect to payment details page
                  window.location.href = "/payment-details";
                }}
                className="mt-2 inline-block py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Provide Card Details
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={clearNotifications}
        className="mt-6 py-2 px-4 bg-brown-600 text-white rounded-lg hover:bg-brown-700"
      >
        Clear Notifications
      </button>
    </div>
  );
};

export default NotificationPage;