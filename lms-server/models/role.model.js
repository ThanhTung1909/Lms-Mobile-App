import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Role = sequelize.define(
    "Role",
    {
      roleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.ENUM("student", "educator", "admin"),
        allowNull: false,
      },
    },
    {
      tableName: "roles",
      timestamps: true,
    }
  );
  return Role;
};
