'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product_Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product_Tag.belongsTo(models.Product,{foreignKey:"product_id",as:"productTagData"})
      Product_Tag.belongsTo(models.Tag,{foreignKey:"tag_id",as:"tagData"})
    }
  }
  Product_Tag.init({
    product_id: DataTypes.INTEGER,
    tag_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Product_Tag',
    freezeTableName:true
  });
  return Product_Tag;
};