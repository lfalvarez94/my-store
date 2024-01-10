//middleware de tipo error para capturar todos$los errores
function logErrors (err, req, res, next){
  console.error(err);
  next(err); // le decimos que siga con la ejecucion
}

//funcion para darle un standar de formato al error se pone los cuatro parametros para que decir que es una funcion de tipo error aunque no se use next
function errorHandler(err, req, res, next){
  res.status(500).json({
    message: err.message,
    stack: err.stack
  })
}

function boomErrorHandler(err, req, res, next){
  if(err.isBoom){
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  }else{
    next(err);
  }
}

module.exports = {logErrors, errorHandler, boomErrorHandler};
