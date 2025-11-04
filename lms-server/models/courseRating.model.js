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
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      rating: { type: DataTypes.INTEGER, allowNull: false },
      comment: { type: DataTypes.TEXT },
    },
    {
      tableName: "course_ratings",
      timestamps: true,
    }
  );
  return CourseRating;
};
