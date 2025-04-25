"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Line extends Model {
    static associate(models) {
      Line.hasMany(models.Station, { foreignKey: "lineId", as: "stations" });
    }
  }

  Line.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Line",
      tableName: "lines",
      timestamps: false,
    }
  );

  return Line;
};
