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
          key: "courseId",
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
          key: "categoryId",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "CourseCategory",
      timestamps: false,
    }
  );

  return CourseCategory;
};
