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
