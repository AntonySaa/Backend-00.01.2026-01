const sequelize = require("../db");
const { Model, DataTypes } = require("sequelize");

class Enrollment extends Model {}

Enrollment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "pending"),
      allowNull: false,
      defaultValue: "pending",
      validate: {
        isIn: {
          args: [["active", "pending"]],
          msg: "Status debe ser active o pending.",
        },
      },
    },
    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Enrollment",
    tableName: "enrollments",
    timestamps: true,
  }
);

module.exports = Enrollment;
