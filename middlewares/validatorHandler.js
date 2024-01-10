const boom = require("@hapi/boom");

//este middleware no lleva el atributo error por no es de ese tipo sino validador
function validatorHandler(schema, property){
  return (req, res, next) => {
    const data = req[property];
    const { error } = schema.validate(data, { abortEarly: false });
    if(error) {
      next(boom.badRequest(error));
    }
    next();
  }
}

module.exports = validatorHandler;
