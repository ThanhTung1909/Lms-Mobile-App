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
    },
    {
      tableName: "enrollments",
      timestamps: true,
    }
  );
  return Enrollment;
};
