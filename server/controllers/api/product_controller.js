const { Product, Category } = require("../../models/index");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});
const upload = multer({ storage });

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: "Internal Server Error" });
};

class ApiProductController {
  static async index(req, res) {
    try {
      const products = await Product.findAll({
        include: {
          model: Category,
          attributes: ["id", "name"],
        },
      });
      res.status(200).json(products);
    } catch (error) {
      handleError(res, error);
    }
  }

  static async show(req, res) {
    try {
      const product = await Product.findByPk(req.params.id, {
        include: {
          model: Category,
          attributes: ["id", "name"],
        },
      });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json(product);
    } catch (error) {
      handleError(res, error);
    }
  }

  static async create(req, res) {
    try {
      const { name, description, price, category_id } = req.body;
      const image = req.file ? req.file.filename : null;

      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({ error: "Invalid category_id" });
      }

      const newProduct = await Product.create({
        name,
        description,
        price,
        category_id,
        image,
      });

      res.status(201).json(newProduct);
    } catch (error) {
      handleError(res, error);
    }
  }

  static async update(req, res) {
    try {
      const { name, description, price, category_id } = req.body;
      const imageFile = req.file ? req.file.filename : null;

      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (category_id) {
        const category = await Category.findByPk(category_id);
        if (!category) {
          return res.status(400).json({ error: "Invalid category_id" });
        }
      }

      const image = imageFile ? imageFile : product.image;

      await product.update({
        name: name || product.name,
        description: description || product.description,
        price: price || product.price,
        category_id: category_id || product.category_id,
        image,
      });

      res.status(200).json(product);
    } catch (error) {
      handleError(res, error);
    }
  }

  static async delete(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      await product.destroy();
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      handleError(res, error);
    }
  }
}

module.exports = { ApiProductController, upload };
