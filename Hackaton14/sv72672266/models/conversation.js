'use strict';

module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define('Conversation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'conversations',
    timestamps: false,
  });

  Conversation.associate = (models) => {
    Conversation.hasMany(models.Message, {
      foreignKey: 'conversation_id',
      as: 'messages',
    });
  };

  return Conversation;
};