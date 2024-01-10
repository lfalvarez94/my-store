const { faker } = require("@faker-js/faker");
const boom = require("@hapi/boom");

class ProductsService{

  constructor(){
    this.products = [];
    this.generate();
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
    const newProduct = {
      id: faker.datatype.uuid(),
      ...data
    }

    this.products.push(newProduct);
    return newProduct;
  }

  async find(){
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const products = this.products;
        if(!products){
          reject(boom.notFound('no found products'));
        }
        resolve(this.products);
      }, 3000);
    });
  }

  async findOne(idProduct){
    const product = this.products.find(item => item.id === idProduct);
    if(!product){
      throw boom.notFound("Product not found");
    }
    if (product.isBlock){
      throw boom.conflict('product is block');
    }
    return product
  }

  async update(idProduct, changes){
    const index = this.products.findIndex(item => item.id === idProduct);
    //const array = this.products.map((product) => product.id !== idProduct ? product : {idProduct, ...changes}); // otra forma de hacerlo con map, sin embargo reemplaza todo el objeto con lo que llega del cliente, serviria mas en el put

    if(index === -1){
      throw boom.notFound('product not found');
    }

    const product = this.products[index];
    this.products[index] = {
      ...product,
      ...changes
    }

    return this.products[index];
  }

  async delete(idProduct){
    const index = this.products.findIndex(item => item.id === idProduct);

    if(index === -1){
      throw boom.notFound('product not found')
    }
    //this.products = this.products.filter(item => item.id !== idProduct); //otra forma de hacerlo mediante filter
    this.products.splice(index, 1);
    return {idProduct};
  }
}

module.exports = ProductsService;
