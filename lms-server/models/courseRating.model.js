import { DataTypes } from "sequelize";

export default (sequelize) => {
  const CourseRating = sequelize.define(
    "CourseRating",
    {
      ratingId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "users", key: "user_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "courses", key: "course_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      rating: { type: DataTypes.INTEGER, allowNull: false },
      comment: { type: DataTypes.TEXT },
    },
    {
      tableName: "course_ratings",
      timestamps: true,
      underscored: true,
    }
  );
  return CourseRating;
};
