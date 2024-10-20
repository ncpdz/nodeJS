const { Model, DataTypes } = require('sequelize');
const sequelize = require("./connectDB");
const Category = require('./category');

class Product extends Model {}

Product.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    category_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Categories',
            key: 'id',
        },
    },
    image: {
        type: DataTypes.STRING,
    },
}, { sequelize, modelName: 'Product' });

Product.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = Product;
