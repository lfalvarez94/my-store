const { faker } = require("@faker-js/faker");
const boom = require("@hapi/boom");
//const pool = require("../libs/postgresPool");
const { models } = require("../libs/sequelize");
const { Op } = require('sequelize');

class ProductsService{

  constructor(){
    this.products = [];
    //this.generate();
    // this.pool = pool;
    // this.pool.on('err', (err) => console.error(err));
  }

  generate(){
    const limit = 10;
    for(let i=0; i < limit; i++){
      this.products.push({
        id: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        price: parseInt(faker.commerce.price(), 10),
        image: faker.image.imageUrl(),
        isBlock: faker.datatype.boolean(),
      })
    }
  }

  async create(data){
    /*const newProduct = {
      id: faker.datatype.uuid(),
      ...data
    }

    this.products.push(newProduct);
    return newProduct;*/
    const newProduct = await models.Product.create(data);
    return newProduct;
  }

  async find(query){
    //const query = 'SELECT * FROM tasks';
    //const [data, metadata] = await sequelize.query(query);
    const options = {
      include: ['category'],
      where: {}
    }
    const {limit, offset} = query;
    if(limit && offset){
      options.limit = limit,
      options.offset = offset;
    }

    const { price } = query;
    if(price){
      options.where.price = price;
    }

    const { priceMin, priceMax } = query;
    if(priceMin && priceMax){
      options.where.price = {
        [Op.gte]: priceMin,
        [Op.lte]: priceMax
      }
    }

    const products = await models.Product.findAll(options);
    return products;
    //const rta = await this.pool.query(query);
    //return rta.rows;
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     const products = this.products;
    //     if(!products){
    //       reject(boom.notFound('no found products'));
    //     }
    //     resolve(this.products);
    //   }, 3000);
    // });
  }

  async findOne(idProduct){
    /*const product = this.products.find(item => item.id === idProduct);
    if(!product){
      throw boom.notFound("Product not found");
    }
    if (product.isBlock){
      throw boom.conflict('product is block');
    }
    return product*/
    const product = await models.Product.findByPk(idProduct);
    if(!product){
      throw boom.notFound("Product not found");
    }
    return product;
  }

  async update(idProduct, changes){
    /*const index = this.products.findIndex(item => item.id === idProduct);
    //const array = this.products.map((product) => product.id !== idProduct ? product : {idProduct, ...changes}); // otra forma de hacerlo con map, sin embargo reemplaza todo el objeto con lo que llega del cliente, serviria mas en el put

    if(index === -1){
      throw boom.notFound('product not found');
    }

    const product = this.products[index];
    this.products[index] = {
      ...product,
      ...changes
    }

    return this.products[index];*/
    const product = await this.findOne(idProduct);
    const newProduct = await product.update(changes);
    return newProduct;
  }

  async delete(idProduct){
    /*const index = this.products.findIndex(item => item.id === idProduct);

    if(index === -1){
      throw boom.notFound('product not found')
    }
    //this.products = this.products.filter(item => item.id !== idProduct); //otra forma de hacerlo mediante filter
    this.products.splice(index, 1);
    return {idProduct};*/
    const product = await this.findOne(idProduct);
    await product.destroy();
    return { idProduct };
  }
}

module.exports = ProductsService;
