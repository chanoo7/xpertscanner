"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Station extends Model {
    static associate(models) {
      Station.belongsTo(models.Line, { foreignKey: "lineId", as: "line" });
      Station.belongsTo(models.Style, { foreignKey: "styleId", as: "style" });
    }
  }

  Station.init(
    {
      name: DataTypes.STRING,
      target: DataTypes.INTEGER,
      actual: DataTypes.INTEGER,
      difference: DataTypes.INTEGER,
      status: DataTypes.STRING,
      lineId: {
        type: DataTypes.INTEGER,
        references: { model: "Lines", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      styleId: {
        type: DataTypes.INTEGER,
        references: { model: "Styles", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Station",
      tableName: "stations",
      timestamps: false,
    }
  );

  return Station;
};
