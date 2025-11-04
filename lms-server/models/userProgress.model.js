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
      completedAt: { type: DataTypes.DATE },
    },
    {
      tableName: "user_progress",
      timestamps: true,
    }
  );
  return UserProgress;
};
