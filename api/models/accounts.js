'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class accounts extends Model {
    static associate(models) {
      // An account has many users
      accounts.hasMany(models.users, {
        foreignKey: 'contactId', // Assuming contactId in users refers to accountId in accounts
        sourceKey: 'accountId',
        as: 'users' // Alias for the association
      });
    }

    toJSON() {
      return { ...this.get(), createdBy: undefined, createdAt: undefined, updatedBy: undefined, updatedAt: undefined };
    }
  }

  accounts.init({
    accountId: DataTypes.STRING,
    legalName: DataTypes.STRING,
    contactInfo: DataTypes.JSON,
    billingInfo: DataTypes.JSON,
    bankingInfo: DataTypes.JSON,
    isClient: DataTypes.BOOLEAN,
    isVendor: DataTypes.BOOLEAN,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'accounts',
  });

  return accounts;
};
