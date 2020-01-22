// IMPORTS  --------------------------------------------------------------------
import { Router } from 'express';
import User from './app/models/User';

// CONTENT ---------------------------------------------------------------------
const routes = new Router();

// define rota raiz
routes.get('/', async (req, res) => {
  /*
   ** Cria usuario teste na rota raiz para avaliar se loader de models esta funcionando
   */
  const user = await User.create({
    name: 'usuario numero um',
    email: 'user1@email.com',
    password_hash: '123456',
  });

  /* Altera res.json() para retornar objeto com usuario criado */
  return res.json(user);
});

// EXPORTS  ---------------------------------------------------------------------
export default routes;
