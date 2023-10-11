'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Cartegory,{foreignKey:"cartegory_id",as:"cartegoryData"})
      Product.hasMany(models.Product_Image,{foreignKey:"product_id",targetKey:"id",as:"productImageData"})
      Product.hasMany(models.Product_Tag,{foreignKey:"product_id",targetKey:"id",as:"productTagData"})
    }
  }
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    feature_image: DataTypes.BLOB,
    content: DataTypes.TEXT('long'),
    user_id: DataTypes.INTEGER,
    cartegory_id: DataTypes.INTEGER,
    view_count:DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};