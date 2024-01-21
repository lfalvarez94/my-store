const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const sequelize = require('sequelize');

class OrderService{
  constructor(){

  }

  async create(data){
    const customer = await models.Customer.findOne({
      where:{
        'user_id': data.userId
      }
    });
    //Otra forma accediendo al customer desde User
    /*const customer = await models.User.findByPk(data.userId, {
      include: [ 'customer' ]
    })*/
    //Otra forma haciendo una subconsulta dentro del create para encontrar el customerId, podria ser mejor porque solo hace una consulta
    /*const query = {
      customerId: sequelize.literal(`(SELECT id FROM customers WHERE user_id = ${data.userId})`),
    }
    const newOrder = await models.Order.create(query);*/
    const newOrder = await models.Order.create({customerId: customer.id});
    return newOrder;
  }

  async addItem(data){
    const newItem = await models.OrderProduct.create(data);
    return newItem;
  }

  async find(){
    const orders = await models.Order.findAll();
    return orders;
  }

  async findByUser(userId){
    const orders = await models.Order.findAll({
      where:{
        '$customer.user.id$': userId
      },
      include: [
        {
          association: 'customer',
          include: ['user']
        }
      ]
    });
    return orders;
  }

  async findOne(idOrder){
    const order = await models.Order.findByPk(idOrder, {
      include: [
        {
          association: 'customer',
          include: ['user']
        },
        'items'
      ]
    });
    if(!order){
      throw boom.notFound('Order not found');
    }
    return order;
  }

  async update(idOrder, changes){
    const order = await this.findOne(idOrder);
    const newOrder = await order.update(changes);
    return newOrder;
  }

  async delete(idOrder){
    const order = await this.findOne(idOrder);
    order.destroy();
    return {idOrder};
  }
}

module.exports = OrderService;
