import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Testimonial = sequelize.define(
    "Testimonial",
    {
      testimonialId: {
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
      content: { type: DataTypes.TEXT },
      isApproved: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      tableName: "testimonials",
      timestamps: true,
      underscored: true,
    }
  );
  return Testimonial;
};
