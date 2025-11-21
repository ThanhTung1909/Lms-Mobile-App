import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Chapter = sequelize.define(
    "Chapter",
    {
      chapterId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      orderIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "courses", key: "course_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "chapters",
      timestamps: true,
      underscored: true,
    }
  );
  return Chapter;
};
