'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductionPlans extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  ProductionPlans.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    style: DataTypes.STRING,
    routeMap: DataTypes.STRING,
    line: DataTypes.STRING,
    shift: DataTypes.STRING,
    productionPlanFrom: DataTypes.DATE,
    productionPlanEnd: DataTypes.DATE,
    targetQty: DataTypes.INTEGER,
    noOfPositions: {
      type: DataTypes.INTEGER,
      defaultValue: 50
    },
  }, {
    sequelize,
    modelName: 'ProductionPlans',
    tableName: 'productionplans',
    timestamps: true
  });

  return ProductionPlans;
};
