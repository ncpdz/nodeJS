const { Model, DataTypes } = require('sequelize');
const sequelize = require("./connectDB");

class Category extends Model {}

Category.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
    },
}, { sequelize, modelName: 'Category' });

Category.associate = (models) => {
    Category.hasMany(models.Product, { foreignKey: 'category_id', onDelete: 'CASCADE' });
};

module.exports = Category;
