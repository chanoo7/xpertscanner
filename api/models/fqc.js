'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class fqc extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  fqc.init({
    timestamp: DataTypes.STRING,
    code: DataTypes.STRING,
    status: DataTypes.STRING,
    component: DataTypes.STRING,
    remarks: DataTypes.JSON,
    media: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'fqc',
  });
  return fqc;
};