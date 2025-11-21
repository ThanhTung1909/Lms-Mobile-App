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
      videoUrl: {
        type: DataTypes.STRING,
        field: "video_url",
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
      chapterId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "chapters", key: "chapter_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "lectures",
      timestamps: true,
      underscored: true,
    }
  );
  return Lecture;
};
