const boom = require('@hapi/boom');
const { models } = require('./../libs/sequelize');

class CategoryService{
  constructor(){

  }

  async find(){
    const categories = await models.Category.findAll();
    return categories;
  }

  async findOne(idCategory){
    const category = await models.Category.findByPk(idCategory, {
      include: ['products']
    });
    if(!category){
      throw boom.notFound('Category not found');
    }
    return category;
  }

  async create(data){
    const newCategory = await models.Category.create(data);
    return newCategory;
  }

  async update(idCategory, changes){
    const category = this.findOne(idCategory);
    const newCategory = await category.update(changes);
    return newCategory;
  }

  async delete(idCategory){
    const category = this.findOne(idCategory);
    await category.destroy();
    return {idCategory};
  }
}

module.exports = CategoryService;
