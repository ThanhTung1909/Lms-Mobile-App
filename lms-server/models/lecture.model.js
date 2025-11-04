import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Lecture = sequelize.define(
    "Lecture",
    {
      lectureId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      video_url: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.TEXT,
      },
      duration: {
        type: DataTypes.INTEGER,
      },
      lectureType: {
        type: DataTypes.ENUM("video", "text", "quiz", "attachment"),
      },
      orderIndex: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "lectures",
      timestamps: true,
    }
  );
  return Lecture;
};
