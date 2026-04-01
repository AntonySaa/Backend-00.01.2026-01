const sequelize = require("../db");
const { Model } = require("sequelize");
const User = require("./User");
const Task = require("./Task");

[User, Task].forEach((M) => {
  if (!M || !(M.prototype instanceof Model))
    throw new Error(`Model ${M?.name ?? M} is not a valid Sequelize Model subclass.`);
});

User.hasMany(Task, { foreignKey: "userId", as: "tasks" });
Task.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = { sequelize, User, Task };
