const express = require('express');
const passport = require('passport');
const { createCategorySchema, updateCategorySchema, getCategorySchema } = require('./../schemas/categorySchema');
const CategoryService = require('./../services/categoryService');
const validatorHandler = require('../middlewares/validatorHandler');
const { checkRoles } = require('../middlewares/authHandler');

const router = express.Router();
const service = new CategoryService();

router.get('/',
  passport.authenticate('jwt', {session: false}),
  checkRoles('admin', 'seller', 'customer'),
  async (req, res, next) => {
    try{
      const categories = await service.find();
      res.json(categories);
    }catch(err){
      next(err);
    }
  }
);

router.get('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('admin', 'seller', 'customer'),
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
  passport.authenticate('jwt', {session: false}),
  checkRoles('admin'),
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
  passport.authenticate('jwt', {session: false}),
  checkRoles('admin'),
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
  passport.authenticate('jwt', {session: false}),
  checkRoles('admin'),
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
