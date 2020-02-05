/* --------------------------------- IMPORTS ---------------------------------*/
import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import RoomController from './app/controllers/RoomController';

/* --------------------------------- CONTENT ---------------------------------*/
const routes = new Router();

/** Define rota PUT para criar novo usuario */
routes.post('/users', UserController.store);
/** Define rota POST para criar nova session */
routes.post('/sessions', SessionController.store);
/** Define rota POST para criar nova sala */
routes.post('/rooms', RoomController.store);

/** Define MIDDLEWARE GLOBAL que vale para rotas que vem apos sua declaracao */
routes.use(authMiddleware);
/** Define rota PUT para editar dados do usuario */
routes.put('/users', UserController.update);
/** Define rota PUT para editar dados da sala */
routes.put('/rooms', RoomController.update);

/* --------------------------------- EXPORTS ---------------------------------*/
export default routes;
