const express = require('express');

const productsRouter = require('./productsRouter');
const usersRouter = require('./usersRouter');
const customersRouter = require('./customersRouter');
const categoriesRouter = require('./categoriesRoutes');
const orderRouter = require('./orderRoutes');
const authRouter = require('./authRoutes');
const profileRouter = require('./profileRouter');

function routerApi(app){
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/products', productsRouter);
  router.use('/users', usersRouter);
  router.use('/customers', customersRouter);
  router.use('/categories', categoriesRouter);
  router.use('/orders', orderRouter);
  router.use('/auth', authRouter);
  router.use('/profile', profileRouter);
}


module.exports = routerApi;
