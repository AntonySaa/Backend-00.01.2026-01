'use strict';

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    conversation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parent_message_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('user', 'assistant'),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'messages',
    timestamps: false,
  });

  Message.associate = (models) => {
    // Relación con conversación
    Message.belongsTo(models.Conversation, {
      foreignKey: 'conversation_id',
      as: 'conversation',
    });

    // Relación consigo mismo (parent)
    Message.belongsTo(models.Message, {
      foreignKey: 'parent_message_id',
      as: 'parent',
    });

    Message.hasMany(models.Message, {
      foreignKey: 'parent_message_id',
      as: 'children',
    });
  };

  return Message;
};