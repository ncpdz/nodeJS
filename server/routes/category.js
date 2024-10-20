const express = require('express');
const router = express.Router();
const CategoriesController = require('../controllers/category_controller');

router.get('/', CategoriesController.index);            
router.get('/create', CategoriesController.new);
router.post('/', CategoriesController.create);   
router.get('/edit/:id', CategoriesController.edit);    
router.put('/:id', CategoriesController.update);       
router.post('/delete/:id', CategoriesController.delete);

module.exports = router;
