const { Model, DataTypes } = require("sequelize");
const sequelize = require('./connectDB');
const Product = require('./product');

class Wishlist extends Model {}

Wishlist.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: "Wishlist",
    tableName: "wishlist",
    timestamps: false,
  }
);
Wishlist.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Wishlist;
