/* --------------------------------- IMPORTS ---------------------------------*/
import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

/* --------------------------------- CONTENT ---------------------------------*/
/** Instancia novo roteador Router do express */
const routes = new Router();
/** Variavel de configuracao do upload usando multer */
const upload = multer(multerConfig);

/** Define rota PUT para criar novo usuario */
routes.post('/users', UserController.store);
/** Define rota POST para criar nova session */
routes.post('/sessions', SessionController.store);

/** Define MIDDLEWARE GLOBAL que vale para rotas que vem apos sua declaracao */
routes.use(authMiddleware);
/** Define rota PUT para editar dados do usuario */
routes.put('/users', UserController.update);
/**
 * Define rota POST para upload de arquivos (com middleware e controller local, sem arquivo separado)
 * Middleware chama variavel upload, metodo 'single' para fazer upload de um arquivo por vez
 */
routes.post('/files', upload.single('file'), (req, res) => {
  return res.json({ ok: true });
});

/* --------------------------------- EXPORTS ---------------------------------*/
export default routes;
