'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sites extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    toJSON() {
      return { ...this.get(), id: undefined, createdBy:undefined, createdAt: undefined, updatedBy:undefined, updatedAt: undefined  }
      
    }
  }
  sites.init({
    siteId: DataTypes.STRING,
    legalName: DataTypes.STRING,
    siteInfo: DataTypes.JSON,
    clientId: DataTypes.STRING,
    assignedVendors: DataTypes.JSON,
    siteLocation: DataTypes.JSON,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'sites',
  });
  return sites;
};