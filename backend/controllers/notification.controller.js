import Notification from "../models/notification.model.js";
export const getNotifications = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: notifications });
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  export const markAsRead = async (req, res) => {
    const { notificationId } = req.params;
  
    try {
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { read: true },
        { new: true }
      );
      res.status(200).json({ success: true, data: notification });
    } catch (error) {
      console.error("Error marking notification as read:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };