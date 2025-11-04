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
    },
    {
      tableName: "chapters",
      timestamps: true,
    }
  );
  return Chapter;
};
