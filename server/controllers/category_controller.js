const { Category } = require('../models/index');

class CategoriesController {
    static async index(req, res) {
        const categories = await Category.findAll();
        res.render('categories/index', { categories });
    }

    static async new(req, res) {
        res.render('categories/create');
    }

    static async create(req, res) {
        const { name, description } = req.body;
        await Category.create({ name, description });
        res.redirect('/categories');
    }

    static async edit(req, res) {
        const category = await Category.findByPk(req.params.id);
        res.render('categories/edit', { category });
    }

    static async update(req, res) {
        const { name, description } = req.body;
        await Category.update({ name, description }, { where: { id: req.params.id } });
        res.redirect('/categories');
    }

    static async delete(req, res) {
        await Category.destroy({ where: { id: req.params.id } });
        res.redirect('/categories');
    }
}

module.exports = CategoriesController;
