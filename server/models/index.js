const sequelize = require("./connectDB");
const Category = require('./category');
const Product = require('./product');
const User = require('./user'); 

const models = { Category, Product, User };
Object.values(models).forEach(model => {
    if (model.associate) {
        model.associate(models);
    }
});

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Các bảng đã được đồng bộ hóa.');
  })
  .catch(err => {
    console.error('Lỗi đồng bộ hóa bảng:', err);
  });

module.exports = models;
