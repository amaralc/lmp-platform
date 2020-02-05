/* --------------------------------- IMPORTS ---------------------------------*/
import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import ToolController from './app/controllers/ToolController';

/* --------------------------------- CONTENT ---------------------------------*/
const routes = new Router();

/** Define rota POST para criar novo usuario */
routes.post('/users', UserController.store);
/** Define rota POST para criar nova session */
routes.post('/sessions', SessionController.store);
/** Define MIDDLEWARE GLOBAL que vale para rotas que vem apos sua declaracao */
routes.use(authMiddleware);
/** Define rota POST para criar nova ferramenta */
routes.post('/tools', ToolController.store);
/** Define rota PUT para editar dados do usuario */
routes.put('/users', UserController.update);

/* --------------------------------- EXPORTS ---------------------------------*/
export default routes;
