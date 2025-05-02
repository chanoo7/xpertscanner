'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmployeeMaster extends Model {
    static associate(models) {
      // No associations defined in the provided schema
    }
  }
  EmployeeMaster.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    EmployeeCode: DataTypes.STRING(20),
    EmployeeName: DataTypes.STRING(100),
    DesignationName: DataTypes.STRING(100),
    ProcessGroup: DataTypes.STRING(100),
    Skill: DataTypes.STRING(100),
  }, {
    sequelize,
    modelName: 'employee_master',
    timestamps: false, // Assuming no createdAt and updatedAt columns
  });
  return EmployeeMaster;
};