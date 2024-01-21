const { Pool } = require('pg');
const { config } = require('../config/config');

let URI = '';
const options = {
  dialect: 'postgres',
  logging: config.isProd ? false : true,
}

if(config.isProd){
  options.connectionString = config.dbUrl;
  options.ssl = {
    rejectUnauthorized: false
  }
}else{
  const USER = encodeURIComponent(config.dbUser);
  const PASSWORD = encodeURIComponent(config.dbPassword);
  const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;
  options.connectionString = URI;
}

const pool = new Pool(options);
// const pool = new Pool({
//   host: 'localhost',
//   port: 5432,
//   user: 'nico',
//   password: 'admmin123',
//   database: 'my_store'
// });

module.exports = pool;

