import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Enrollment = sequelize.define(
    "Enrollment",
    {
      enrollmentId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      pricePaid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      enrolledAt: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.ENUM("active", "cancelled", "refunded"),
        defaultValue: "active",
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "users", key: "user_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "courses", key: "course_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "enrollments",
      timestamps: true,
      underscored: true,
    }
  );
  return Enrollment;
};
