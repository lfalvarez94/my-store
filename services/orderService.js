const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const { Association } = require('sequelize');

class OrderService{
  constructor(){

  }

  async create(data){
    const newOrder = await models.Order.create(data);
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
