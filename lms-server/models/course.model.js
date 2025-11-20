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
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Tên khoá học không được để trống" },
          len: {
            args: [3, 255],
            msg: "Tên khoá học phải từ 3 đến 255 ký tự",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
        validate: {
          isDecimal: { msg: "Giá phải là số hợp lệ" },
          min: { args: [0], msg: "Giá không được âm" },
        },
      },
      discount: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0.0,
        validate: {
          min: { args: [0], msg: "Giảm giá không được âm" },
          max: { args: [100], msg: "Giảm giá không quá 100%" },
        },
      },
      thumbnailUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: { msg: "Thumbnail phải là một URL hợp lệ" },
        },
      },
      status: {
        type: DataTypes.ENUM("draft", "published", "archived"),
        defaultValue: "draft",
      },
    },
    {
      tableName: "courses",
      timestamps: true,
      underscored: true,
    }
  );

  return Course;
};
