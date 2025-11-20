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
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Tên bài giảng không được để trống" },
          len: {
            args: [3, 255],
            msg: "Tên bài giảng phải từ 3 đến 255 ký tự",
          },
        },
      },
      videoUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: { msg: "Video URL không hợp lệ" },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: { msg: "Thời lượng phải là số nguyên" },
          min: { args: [0], msg: "Thời lượng không được âm" },
        },
      },
      lectureType: {
        type: DataTypes.ENUM("video", "text", "quiz", "attachment"),
        allowNull: false,
        defaultValue: "video",
      },
      orderIndex: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: { msg: "Thứ tự phải là số nguyên" },
          min: { args: [1], msg: "Thứ tự phải >= 1" },
        },
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
