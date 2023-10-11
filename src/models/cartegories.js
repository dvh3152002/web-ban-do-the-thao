'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cartegory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cartegory.hasMany(models.Product,{foreignKey:"cartegory_id",targetKey:"id",as:"cartegoryData"})
    }
  }
  Cartegory.init({
    name: DataTypes.STRING,
    parent_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Cartegory',
  });
  return Cartegory;
};