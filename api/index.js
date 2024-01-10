const express = require('express'); // importamos el modulo de express
const cors = require('cors');
const routerApi = require('./routes');
const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/errorHandler')
// const { faker } = require("@faker-js/faker");
const app = express(); // creamos un app simplemente invocando al contructor de express
const port = process.env.PORT || 3000; // variable para el puerto

app.use(express.json());

const whitelist = ['http://localhost:5500', 'http://localhost'];
const options = {
  origin: (origin, callback) => {
    if(whitelist.includes(origin)){
      callback(null, true);
    }else{
      callback(new Error('no permitido'));
    }
  }
}
app.use(cors(options));

//Crear ruta para el servidor, las rutas siempre tienen dos parametros el request y el response
app.get('/api', (req, res) =>{
  res.send('Hola mi server en express'); //enviar al response un mensaje
});

app.get('/api/nueva-ruta', (req, res) =>{
  res.send('Hola soy una nueva ruta'); //enviar al response un mensaje
});

routerApi(app);


//los middlewares se deben usar despues del routing
//el orden tambien es importante para que se ejecute el middleware que queremos primero y despues
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);


// app.get('/products', (req, res) =>{
//   const products = [];
//   const { size } = req.query;
//   const limit = size || 10;
//   for(let i=0; i < limit; i++){
//     products.push({
//       name: faker.commerce.productName(),
//       price: parseInt(faker.commerce.price(), 10),
//       image: faker.image.imageUrl()
//     })
//   }
//   res.json(products);
//   res.json([
//     {
//       name: 'Producto 1',
//       price: 1000
//     },
//     {
//       name: 'Producto 2',
//       price: 2000
//     }
//   ]); //enviar al response un mensaje
// });

// app.get('/products/:id', (req, res) =>{
//   const { id } = req.params; // para extraer el id que me viene en la peticion url, este debe tener el mismo nombre que el declarado en la ruta, en este caso id
//   res.json(
//     {
//       id: id,
//       name: 'Producto 1',
//       price: 1000
//     }
//   ); //enviar al response un mensaje
// });

// app.get('/users', (req, res) => {
//   const { limit, offset } = req.query;
//   if(limit && offset){
//     res.json({
//       limit,
//       offset
//     })
//   }else{
//     res.send('No hay parametros')
//   }
// })

// app.get('/categories/:categoryId/products/:productId', (req, res) => {
//   const { categoryId, productId } = req.params;
//   res.json(
//     {
//       categoryId: categoryId,
//       productId: productId,
//     }
//   );
// })

app.listen(port, () =>{
  console.log(`Mi port ${port}`);
}); //escuchar en el puerto que definimos
