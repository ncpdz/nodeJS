const { DataTypes } = require('sequelize');
const sequelize = require('./connectDB');
const Product = require('./product'); 

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
}, {
    tableName: 'carts',
    timestamps: true,
});

Cart.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Cart;