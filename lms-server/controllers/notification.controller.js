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
    const userId = req.user.id;
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
    const userId = req.user.id;
    await Notification.updateMany(
      { recipientId: userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ success: true, message: "Marked all as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params; 
    const userId = req.user.id

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipientId: userId },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Thông báo không tồn tại hoặc bạn không có quyền sở hữu.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Đã đánh dấu thông báo là đã đọc.",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
