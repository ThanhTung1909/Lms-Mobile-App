import { DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatarUrl: {
        type: DataTypes.STRING,
        field: "avatar_url",
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "banned"),
        defaultValue: "active",
      },
      emailVerifiedAt: {
        type: DataTypes.DATE,
        field: "email_verified_at",
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        field: "last_login_at",
      },
    },
    {
      tableName: "users",
      timestamps: true,
      underscored: true,
    }
  );
  return User;
};
