const express = require('express');
const { createCategorySchema, updateCategorySchema, getCategorySchema } = require('./../schemas/categorySchema');
const CategoryService = require('./../services/categoryService');
const validatorHandler = require('../middlewares/validatorHandler');

const router = express.Router();
const service = new CategoryService();

router.get('/', async (req, res, next) => {
  try{
    const categories = await service.find();
    res.json(categories);
  }catch(err){
    next(err);
  }
});

router.get('/:id',
  validatorHandler(getCategorySchema, 'params'),
  async (req, res, next) => {
    try{
      const { id } = req.params;
      const category = await service.findOne(id);
      res.json(category);
    }catch(err){
      next(err);
    }
  }
);

router.post('/',
  validatorHandler(createCategorySchema, 'body'),
  async (req, res, next) => {
    try{
      const { body } = req;
      const newCategory = await service.create(body);
      res.status(201).json(newCategory);
    }catch(err){
      next(err);
    }
  }
);

router.patch('/:id',
  validatorHandler(getCategorySchema, 'params'),
  validatorHandler(updateCategorySchema, 'body'),
  async (req, res, next) => {
    try{
      const { body, params: {id} } = req;
      const newCategory = await service.update(id, body);
      res.status(200).json(newCategory);
    }catch(err){
      next(err);
    }
  }
)

router.delete('/:id',
  validatorHandler(getCategorySchema, 'params'),
  async (req, res, next) => {
    try{
      const { id } = req.params;
      const idCategory = await service.delete(id);
      res.status(200).json(idCategory);
    }catch(err){
      next(err);
    }
  }
)

module.exports = router;
