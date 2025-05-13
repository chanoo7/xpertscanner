'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class production extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  production.init({
    timestamp: DataTypes.STRING,
    stationId: DataTypes.STRING,
    code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'production',
  });
  return production;
};