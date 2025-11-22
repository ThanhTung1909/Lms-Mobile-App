import Notification from "../models_mongo/Notification.js";

export const createNotification = async ({
  recipientId,
  senderId,
  type,
  title,
  message,
  metadata,
}) => {
  try {
    await Notification.create({
      recipientId,
      senderId,
      type,
      title,
      message,
      metadata,
    });

  } catch (error) {
    console.error("Create Notification Error:", error);
  }
};


export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;

    const notifications = await Notification.find({ recipientId: userId })
      .sort({ createdAt: -1 }) 
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const unreadCount = await Notification.countDocuments({
      recipientId: userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    await Notification.updateMany(
      { recipientId: userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ success: true, message: "Marked all as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
