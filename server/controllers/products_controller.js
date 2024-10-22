const { Product, Category } = require('../models/index');

class ProductsController {
    static async index(req, res) {
        try {
            const products = await Product.findAll({
                include: {
                    model: Category,
                    attributes: ['id', 'name'], 
                },
            });
            console.log(JSON.stringify(products, null, 2)); 
            res.render('products/index', { products });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching products');
        }
    }

    static async new(req, res) {
        try {
            const categories = await Category.findAll();
            res.render('products/create', { categories });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching categories');
        }
    }

    static async create(req, res) {
        try {
            const { name, description, price, category_id } = req.body;
            const image = req.file ? req.file.filename : null;
            await Product.create({ name, description, price, category_id, image });
            res.redirect('/products');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error creating product');
        }
    }

    static async edit(req, res) {
        try {
            const product = await Product.findByPk(req.params.id, { include: Category });
            const categories = await Category.findAll();
            res.render('products/edit', { product, categories });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching product for editing');
        }
    }

    static async update(req, res) {
        try {
            const { name, description, price, category_id } = req.body;
            const imageFile = req.file ? req.file.filename : null;

            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).send('Product not found');
            }

            const image = imageFile ? imageFile : product.image;

            // console.log(`Updating Product ID: ${req.params.id}`);
            // console.log({ name, description, price, category_id, image });

            await Product.update(
                { name, description, price, category_id, image },
                { where: { id: req.params.id } }
            );
            res.redirect('/products');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error updating product');
        }
    }

    static async delete(req, res) {
        try {
            await Product.destroy({ where: { id: req.params.id } });
            res.redirect('/products');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error deleting product');
        }
    }
}

module.exports = ProductsController;
