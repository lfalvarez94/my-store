const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const UsersService  = require('./usersService');
const jwt = require('jsonwebtoken');
const { config } = require('./../config/config');

const service = new UsersService();

class AuthService{
  constructor(){

  }

  async getUser(email, password){
    const user = await service.findByEmail(email);
    if(!user){
      throw boom.unauthorized('Not authorized');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      throw boom.unauthorized();
    }
    delete user.dataValues.password;
    return user;
  }

  signToken(user){
    const payload = {
      sub: user.id,
      role: user.role
    }
    const token = jwt.sign(payload, config.jwtSecret);
    return {
      user,
      token
    }
  }

  async sendRecovery(email){
    const user = await service.findByEmail(email);
    if(!user){
      throw boom.unauthorized('Not authorized');
    }
    const payload = {sub: user.id}
    const token = jwt.sign(payload, config.jwtSecret, {expiresIn: '15min'});
    const link = `http://myfronted.com/recovery?token=${token}`;
    await service.update(user.id, {recoveryToken: token});
    const mail = {
      from: config.emailUser, // sender address
      to: `${user.email}`, // list of receivers
      subject: "Email para recuperar contraseña", // Subject line
      html: `<b>Ingresa a este link -> ${link}</b>`, // html body
    }
    const rta = await this.sendMail(mail);
    return rta;
  }

  async changePassword(token, newPassword) {
    const payload = jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        throw boom.notAcceptable(err.name);
      }
      return decoded;
    });
    const user = await service.findOne(payload.sub);
    if(user.recoveryToken !== token){
      throw boom.unauthorized('Sorry, valid but not the same token');
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await service.update(user.id, {
      recoveryToken: null,
      password: hash
    });
    return { message: 'password change' }
  }

  async sendMail(infoMail){
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });
    await transporter.sendMail(infoMail);
    return { message: 'Mail sent'}
  }
}

module.exports = AuthService;
