const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(15).messages({
  'string.base': `" nombre "debe ser un tipo de 'texto'`,
  'string.empty': `"nombre "no puede ser un campo vacío`,
  'string.min': `"nombre" debe tener una longitud mínima de {#limit}`,
  'string.max': `"nombre" debe tener una longitud máxima de {#limit}`
});//para usar mensaje de salidad en espaniol
const description = Joi.string().min(5).max(50);
const price = Joi.number().integer().min(10);
const image = Joi.string().uri();
const categoryId = Joi.number().integer();
const limit = Joi.number().integer();
const offset = Joi.number().integer();
const priceMin = Joi.number().integer().min(10);
const priceMax = Joi.number().integer().min(10);

const createProductSchema = Joi.object({
  name: name.required(),
  description: description.required(),
  price: price.required(),
  image: image.required(),
  categoryId: categoryId.required()
});

const updateProductSchema = Joi.object({
  name: name,
  description: description,
  price: price,
  image: image,
  categoryId
});

const getProductSchema = Joi.object({
  id: id.required(),
});

const queryProductSchema = Joi.object({
  limit,
  offset,
  price,
  priceMin,
  priceMax: priceMax.when('priceMin', {
    is: Joi.exist(),
    then: Joi.required()
  }).greater(Joi.ref('priceMin'))// el greater valida que el price Max sea mayor que pricemin
});

//otra forma de solucionar el price min y price max como obligatorios en caso que exista el uno o el otro
/*const queryProductSchema = Joi.object({
  limit,
  offset,
  price,
  priceMin,
  priceMax: priceMax.greater(Joi.ref('priceMin'))
}).and('priceMin', 'priceMax');*/

module.exports = { createProductSchema, updateProductSchema, getProductSchema, queryProductSchema };
