import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Course = sequelize.define(
    "Course",
    {
      courseId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      discount: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0.0,
      },
      // SỬA: thumbnaiUrl -> thumbnailUrl (thêm chữ "l")
      thumbnailUrl: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM("draft", "published", "archived"),
        defaultValue: "draft",
      },
      // creatorId sẽ được Sequelize tự động thêm
    },
    {
      tableName: "courses",
      timestamps: true,
    }
  );
  return Course;
};