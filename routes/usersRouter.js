const express = require('express');
const UsersService = require('../services/usersService');
const validatorHandler = require('../middlewares/validatorHandler');
const { createUserSchema, updateUserSchema, getUserSchema } = require('../schemas/userSchema');

const router = express.Router();
const service = new UsersService();

router.get('/', async (req, res, next) => {
  try{
    const users = await service.find();
    res.json(users);
  }catch(err) {
    next(err);
  }
})

router.get('/:id',
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
  try{
    const { id } = req.params;
    const user = await service.findOne(id);
    res.json(user)
  }catch(err) {
    next(err);
  }
})

router.post('/',
  validatorHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try{
      const { body } = req;
      const user = await service.create(body);
      res.status(201).json(user);
    }catch(err){
      next(err);
    }
  }
)

router.patch('/:id',
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  async (req, res, next) => {
    try{
      const { body, params:{id}} = req;
      const user = await service.update(id, body);
      res.status(200).json(user);
    }catch(err){
      next(err);
    }
})

router.delete('/:id',
validatorHandler(getUserSchema, 'params'),
async (req, res, next) => {
  try{
    const { id } = req.params;
    const idUser = await service.delete(id);
    res.status(200).json(idUser);
  }catch(err){
    next(err);
  }
})

module.exports = router;
