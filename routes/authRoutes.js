const express = require('express');
const passport = require('passport');
const AuthService = require('./../services/authService');
const { recoveryPasswordSchema, loginSchema, changePasswordSchema } = require('./../schemas/authSchema');
const validatorHandler = require('./../middlewares/validatorHandler');

const router = express.Router();
const service = new AuthService();

router.post('/login',
  validatorHandler(loginSchema, 'body'),
  passport.authenticate('local', {session: false}),
  async (req, res, next) => {
    try{
      const rta = service.signToken(req.user)
      res.json(rta);
    }catch(err){
      next(err);
    }
  }
);

router.post('/recovery',
  validatorHandler(recoveryPasswordSchema, 'body'),
  async (req, res, next) => {
    try{
      const { email } = req.body;
      const rta = await service.sendRecovery(email);
      res.json(rta);
    }catch(err){
      next(err);
    }
  }
);

router.post('/change-password',
  validatorHandler(changePasswordSchema, 'body'),
  async (req, res, next) => {
    try{
      const { token, newPassword } = req.body;
      const rta = await service.changePassword(token, newPassword);
      res.json(rta);
    }catch(err){
      next(err);
    }
  }
);

module.exports = router;
