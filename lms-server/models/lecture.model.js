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
      //  video_url -> videoUrl (camelCase)
      videoUrl: {
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
      //  Đảm bảo Sequelize không tự động chuyển đổi tên cột
      underscored: false,
    }
  );
  return Lecture;
};