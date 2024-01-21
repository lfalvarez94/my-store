const Joi = require('joi');
const { createUserSchema, updateUserSchema } = require('./userSchema');

const id = Joi.number().integer();
const name = Joi.string().min(2).max(20);
const lastName = Joi.string().min(2).max(20);
const phone = Joi.string().min(10);
//const userId = Joi.number().integer();

const createCustomerSchema = Joi.object({
  name: name.required(),
  lastName: lastName.required(),
  phone: phone.required(),
  user: createUserSchema.required()
  //userId: userId.required()
})

const updateCustomerSchema = Joi.object({
  name: name,
  lastName: lastName,
  phone: phone,
  user: updateUserSchema
  //userId
})

const getCustomerSchema = Joi.object({
  id: id.required(),
})

module.exports = { createCustomerSchema, updateCustomerSchema, getCustomerSchema };
