import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Category = sequelize.define(
    "Category",
    {
      categoryId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "categories",
      timestamps: true,
      underscored: true,
    }
  );
  return Category;
};
