const { models } = require('./../libs/sequelize');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

class CustomersService{
  constructor(){
    this.customers = [];
  }

  async find() {
    const rta = await models.Customer.findAll({
      include: ['user']
      //include: [{ all: true }] // Para traer todas las relaciones que tenga la tabla
    });
    return rta;
  }

  async findOne(idCustomer){
    const user = await models.Customer.findByPk(idCustomer, {
      include: ['orders']
    });
    if(!user){
      throw boom.notFound('user not found');
    }
    return user;
  }

  async create(data) {
    /*const newUser = await models.User.create(data.user);
    const newCustomer = await models.Customer.create({
      ...data,
      userId: newUser.id
    });*/
    const hash = await bcrypt.hash(data.user.password, 10);
    const newData = {
      ...data,
      user: {
        ...data.user,
        password: hash
      }
    }
    const newCustomer = await models.Customer.create(newData, {
      include: 'user'
    })

    delete newCustomer.user.dataValues.password
    return newCustomer;
  };

  async update(idCustomer, data) {
    const user = await this.findOne(idCustomer);
    const rta = await user.update(data);
    return rta;
  }

  async delete(idUser) {
    const user = await this.findOne(idUser);
    await user.destroy();
    return {idUser};
  }

}

module.exports = CustomersService;
