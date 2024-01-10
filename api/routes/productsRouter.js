const express = require('express'); // importamos el modulo de express
const ProductsService = require('../services/productsService');
const validatorHandler = require('../middlewares/validatorHandler');
const { createProductSchema, updateProductSchema, getProductSchema } = require('.././schemas/productSchema');

const router = express.Router();
const service = new ProductsService();

router.get('/', async (req, res, next) =>{
  try{
    const products = await service.find();
    res.json(products);
  }catch(err){
    next(err);
  }
});

router.get('/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) =>{
  try{
    const { id } = req.params; // para extraer el id que me viene en la peticion url, este debe tener el mismo nombre que el declarado en la ruta, en este caso id
    const product = await service.findOne(id);
    res.json(product);
  }catch(err){
    next(err);
  }

  // (id === '999')
  // ? res.status(404).json(
  //   {
  //     message: 'Product no found'
  //   }
  // )
  // : res.status(200).json(
  //   {
  //     id: id,
  //     name: 'Producto 1',
  //     price: 1000
  //   }
  // ); //enviar al response un mensaje
});

router.post('/',
  validatorHandler(createProductSchema, 'body'),
  async (req, res) => {
  const body = req.body;
  const newProduct = await service.create(body);
  res.status(201).json(newProduct);
})
// permite actualizar uno o mas atributos del producto
router.patch('/:id',
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async(req, res, next) => {
  try{
    const { id } = req.params;
    const body = req.body;
    const product = await service.update(id, body);
    res.json(product);
  }catch(err){
    next(err);
  }
})
//se debe enviar todos los atributos del producto
router.put('/:id', (req, res)=> {
  const { body, params: {id} } = req;

  res.json({
      message: `update product with id ${id}`,
      data: {
          id,
          ...body
      }
  })
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const rta = await service.delete(id)
  res.json(rta);
})

module.exports = router;
