import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Role = sequelize.define(
    "Role",
    {
      roleId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: "role_id",
      },
      name: {
        type: DataTypes.ENUM("student", "educator", "admin"),
        allowNull: false,
      },
    },
    {
      tableName: "roles",
      timestamps: true,
      underscored: true,
    }
  );
  return Role;
};
