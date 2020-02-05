/* --------------------------------- IMPORTS ---------------------------------*/
import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ContainerController from './app/controllers/ContainerController';
import authMiddleware from './app/middlewares/auth';

/* --------------------------------- CONTENT ---------------------------------*/
const routes = new Router();

/** Define rota PUT para criar novo usuario */
routes.post('/users', UserController.store);
/** Define rota POST para criar nova session */
routes.post('/sessions', SessionController.store);

/** Define MIDDLEWARE GLOBAL que vale para rotas que vem apos sua declaracao */
routes.use(authMiddleware);
/** Define rota PUT para editar dados do usuario */
routes.put('/users', UserController.update);
/** Define rota POST para criar novo container */
routes.post('/containers', ContainerController.store);

/* --------------------------------- EXPORTS ---------------------------------*/
export default routes;
