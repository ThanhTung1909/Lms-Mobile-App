import { DataTypes } from "sequelize";

export default (sequelize) => {
  const CourseCategory = sequelize.define(
    "CourseCategory",
    {
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "courses",
          key: "course_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "categories",
          key: "category_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "course_categories",
      timestamps: false,
      underscored: true,
    }
  );

  return CourseCategory;
};
