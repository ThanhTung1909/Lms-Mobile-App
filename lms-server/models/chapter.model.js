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
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Tiêu đề chương không được để trống" },
          len: {
            args: [3, 255],
            msg: "Tiêu đề chương phải từ 3 đến 255 ký tự",
          },
        },
      },
      orderIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: "Thứ tự chương phải là số nguyên" },
          min: { args: [1], msg: "Thứ tự phải >= 1" },
        },
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
