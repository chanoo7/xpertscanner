'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contacts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      contacts.hasMany(models.users, {
        foreignKey: 'userId',
        sourceKey: 'contactId',
        as: 'users' 
      });
    }

    toJSON() {
      return { ...this.get(), id: undefined, createdBy:undefined, createdAt: undefined, updatedBy:undefined, updatedAt: undefined  }
      
    }
  }
  contacts.init({
    contactId: DataTypes.STRING,
    legalName: DataTypes.STRING,
    assignedEmployer: DataTypes.STRING,
    assignedSites: DataTypes.JSON,
    designation: DataTypes.STRING,
    personalInfo: DataTypes.JSON,
    employmentInfo: DataTypes.JSON,
    bankingInfo: DataTypes.JSON,
    miscInfo: DataTypes.JSON,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'contacts',
  });
  return contacts;
};