const { faker } = require("@faker-js/faker");
const boom = require("@hapi/boom");
const bcrypt = require('bcrypt');
//const getConnection = require('./../libs/postgres');
//const pool = require('./../libs/postgresPool');
const { models } = require('./../libs/sequelize');

class UsersService{
  constructor(){
    this.users = [];
    this.generate();
    //this.pool = pool;
    //this.pool.on('err', (err) => console.error(err));
  }

  generate() {
    const limit = 5;
    for (let index = 0; index < limit; index++) {
      this.users.push({
        id: faker.datatype.uuid(),
        name: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
      });
    };
  };

  async find() {
    // const client = await getConnection();
    // const rta = await client.query('SELECT * FROM tasks');
    //const query = 'SELECT * FROM tasks';
    //const rta = await pool.query(query);
    const rta = await models.User.findAll({
      include: [ 'customer' ]
    });
    return rta;
    //return this.users;
  }

  async findByEmail(email) {
    const rta = await models.User.findOne({
      where: { email }
    });
    return rta;
    //return this.users;
  }

  async findOne(idUser){
    const user = await models.User.findByPk(idUser);
    if(!user){
      throw boom.notFound('user not found');
    }
    /*const user = this.users.find(user => user.id === idUser);
    if(!user){
      throw boom.notFound("User not found");
    }*/
    return user;
  }

  async create(data) {
    const hash = await bcrypt.hash(data.password, 10);
    const newUser = await models.User.create({
      ...data,
      password: hash
    });
    /*const newUser = {
      id: faker.datatype.uuid(),
      ...data
    };
    this.users.push(newUser);*/
    delete newUser.dataValues.password; //Se elimina el campo password del usuario, el dataValues es por sequelize si fuera otro orm deberia ser diferente talvez solo delete newUser.password
    return newUser; // No debemos retornar el password porue es una falla de seguridad
  };

  async update(idUser, data) {
    const user = await this.findOne(idUser);
    const rta = await user.update(data);
    /*if(!this.users.some(user => user.id === idUser)){
      throw boom.notFound('user not found');
    }
    const newUsers = this.users.map(user => user.id !== idUser ? user: {...user, ...data});*/
    return rta;
  }

  async delete(idUser) {
    const user = await this.findOne(idUser);
    await user.destroy();
    /*const index = this.users.findIndex(item => item.id === idUser);
    if (index === -1){
      throw boom.notFound("user not found");
    }
    this.users.splice(index, 1);*/
    return {idUser};
  }
}

module.exports = UsersService;
