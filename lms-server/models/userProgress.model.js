import { DataTypes } from "sequelize";

export default (sequelize) => {
  const UserProgress = sequelize.define(
    "UserProgress",
    {
      progressId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      lectureId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "lectures",
          key: "lecture_id",
        },
      },
      lastWatchedSecond: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "last_watched_second",
        comment: "Lưu giây cuối cùng người dùng xem",
      },
      isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_completed",
        comment: "Đánh dấu nhanh trạng thái hoàn thành",
      },
      completedAt: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.ENUM("not_started", "in_progress", "completed"),
        defaultValue: "not_started",
      },
    },
    {
      tableName: "user_progress",
      timestamps: true,
      underscored: true,
    }
  );

  return UserProgress;
};
