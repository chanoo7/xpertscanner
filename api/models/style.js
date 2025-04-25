"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Style extends Model {
    static associate(models) {
      Style.hasMany(models.Station, { foreignKey: "styleId", as: "stations" });
    }
  }

  Style.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Style",
      tableName: "styles",
      timestamps: false,
    }
  );

  return Style;
};
