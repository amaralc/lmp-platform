// IMPORTS  ---------------------------------------------------------------------
const {Router} = require('express');

// CONTENT ---------------------------------------------------------------------

// define routes como nov
const routes = new Router();

// define rota raiz 
routes.get('/', (req,res)=>{
  res.json({message: 'Hello World!'});
});

// EXPORTS  ---------------------------------------------------------------------
module.exports = routes; 