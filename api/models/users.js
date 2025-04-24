'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    static associate(models) {
      users.belongsTo(models.contacts, {
        foreignKey: 'userId',
        targetKey: 'contactId',
        as: 'contact' 
      });
    }
  }

  users.init({
    userId: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    contactId: DataTypes.STRING, // Foreign Key linking to accounts
    type: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    allowedClient: DataTypes.STRING,
    isLoggedin: DataTypes.BOOLEAN,
    isWebLogin: DataTypes.BOOLEAN,
    isMobileLogin: DataTypes.BOOLEAN,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
    failedAttempts: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });

  return users;
};
