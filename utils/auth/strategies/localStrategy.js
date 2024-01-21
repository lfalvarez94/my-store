const { Strategy } = require('passport-local');
const AuthService  = require('./../../../services/authService');

const service = new AuthService();

const LocalStrategy = new Strategy({
    usernameField: 'email', // POr defecto Strategy pide como parametro Username, esto es para cmabiar e·nombre y llevar una misma estructura
    passwordField: 'password'
  },
  async (email, password, done) => {
    try{
      const user = await service.getUser(email, password);
      done(null, user);
    }catch(err){
      done(err, false);
    }
  }
);

module.exports = LocalStrategy;
