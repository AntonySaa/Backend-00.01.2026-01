const sequelize = require("../db");
const { Model, DataTypes } = require("sequelize");

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "El comentario no puede estar vacio." },
        len: { args: [1, 99999], msg: "El comentario debe tener al menos 1 caracter." },
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lessonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Comment",
    tableName: "comments",
    timestamps: true,
  }
);

Comment.beforeCreate((comment) => {
  if (comment.body) comment.body = comment.body.trim();
  if (!comment.body) throw new Error("El comentario no puede estar vacio despues del trim.");
});

module.exports = Comment;
