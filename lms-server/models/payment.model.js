import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Payment = sequelize.define(
    "Payment",
    {
      paymentId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
      stripePaymentId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "succeeded", "failed"),
        defaultValue: "pending",
      },
    },
    {
      tableName: "payments",
      timestamps: true,
      underscored: true,
    }
  );

  return Payment;
};
