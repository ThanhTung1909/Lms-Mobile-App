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
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "enrollments",
      timestamps: true,
    }
  );
  return Enrollment;
};
