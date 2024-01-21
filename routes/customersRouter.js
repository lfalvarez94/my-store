const express = require('express');
const CustomersService = require('../services/customersService');
const validatorHandler = require('../middlewares/validatorHandler');
const { createCustomerSchema, getCustomerSchema, updateCustomerSchema } = require('../schemas/customerSchema');

const router = express.Router();
const service = new CustomersService();

router.get('/', async (req, res, next) => {
  try{
    const customers = await service.find();
    res.json(customers);
  }catch(err) {
    next(err);
  }
})

router.get('/:id',
  validatorHandler(getCustomerSchema, 'params'),
  async (req, res, next) => {
  try{
    const { id } = req.params;
    const customer = await service.findOne(id);
    res.json(customer)
  }catch(err) {
    next(err);
  }
})

router.post('/',
  validatorHandler(createCustomerSchema, 'body'),
  async (req, res, next) => {
    try{
      const { body } = req;
      const customer = await service.create(body);
      res.status(201).json(customer);
    }catch(err){
      next(err);
    }
  }
)

router.patch('/:id',
  validatorHandler(getCustomerSchema, 'params'),
  validatorHandler(updateCustomerSchema, 'body'),
  async (req, res, next) => {
    try{
      const { body, params:{id}} = req;
      const customer = await service.update(id, body);
      res.status(200).json(customer);
    }catch(err){
      next(err);
    }
})

router.delete('/:id',
validatorHandler(getCustomerSchema, 'params'),
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
