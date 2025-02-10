import Notification from "../models/notification.model.js";
export const getNotifications = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const notifications = await Notification.find({ userId: userId }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: notifications });
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  export const markAsRead = async (req, res) => {
    const { notificationId } = req.params;
  
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, read: false }, // Find the notification with the given ID AND read: false
            { read: true },                   // Update read to true
            { new: true }                    // Return the updated document
        );
        
        if (!notification) {
            // Handle the case where the notification was not found or was already read.
            return res.status(404).json({ success: false, message: "Notification not found or already marked as read" });
        }
      res.status(200).json({ success: true, data: notification });
    } catch (error) {
      console.error("Error marking notification as read:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };