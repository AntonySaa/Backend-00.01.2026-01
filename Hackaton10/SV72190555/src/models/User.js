const sequelize = require("../db");
const { Model, DataTypes } = require("sequelize");

class User extends Model {}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El nombre no puede estar vacio." },
        len: { args: [2, 80], msg: "El nombre debe tener entre 2 y 80 caracteres." },
      },
    },
    lastName: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El apellido no puede estar vacio." },
        len: { args: [2, 80], msg: "El apellido debe tener entre 2 y 80 caracteres." },
      },
    },
    email: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: { name: "users_email_unique", msg: "El correo ya existe." },
      validate: {
        isEmail: { msg: "Debe ser un email valido." },
        notEmpty: { msg: "El email no puede estar vacio." },
      },
    },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    defaultScope: { attributes: { exclude: ["passwordHash"] } },
    scopes: { withPassword: { attributes: {} } },
  }
);

User.beforeValidate((user) => {
  if (user.firstName) user.firstName = user.firstName.trim();
  if (user.lastName) user.lastName = user.lastName.trim();
  if (user.email) user.email = user.email.trim();
});

module.exports = User;
