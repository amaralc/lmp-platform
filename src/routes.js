/* --------------------------------- IMPORTS ---------------------------------*/
import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import authMiddleware from './app/middlewares/auth';

/** Controllers */
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import RoomController from './app/controllers/RoomController';
import ContainerController from './app/controllers/ContainerController';
import ToolController from './app/controllers/ToolController';
import EquipmentController from './app/controllers/EquipmentController';
import LabController from './app/controllers/LabController';
import ProviderController from './app/controllers/ProviderController';
import BookingController from './app/controllers/BookingController';
import EquipmentScheduleController from './app/controllers/EquipmentScheduleController';
import AppointmentController from './app/controllers/AppointmentController';
import ProviderScheduleController from './app/controllers/ProviderScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

/* --------------------------------- CONTENT ---------------------------------*/
/** Instancia novo roteador Router do express */
const routes = new Router();
const upload = multer(multerConfig);

/** Define rota POST para criar novo usuario */
routes.post('/users', UserController.store);
/** Define rota POST para criar nova session */
routes.post('/sessions', SessionController.store);
/** Define rota GET para listagem de equipamentos que estão disponíveis */
routes.get('/equipment', EquipmentController.index);

/** Define rota get de teste para avaliar integração contínua com buddy works */
routes.get('/', (req, res) => res.json({ 'lmp-platform': 'Up and running!' }));

/** Define MIDDLEWARE GLOBAL que vale para rotas que vem apos sua declaracao */
routes.use(authMiddleware);
/** Define rota PUT para editar dados do usuario */
routes.put('/users', UserController.update);
/**
 * Define rota POST para upload de arquivos (com middleware local)
 * Middleware chama variavel upload, metodo 'single' para fazer upload de
 * um arquivo por vez
 */
routes.post('/files', upload.single('file'), FileController.store);
/** Define rota POST para criar nova sala */
routes.post('/rooms', RoomController.store);
/** Define rota PUT para editar salas */
routes.put('/rooms', RoomController.update);

/** Define rota POST para criar novo container */
routes.post('/containers', ContainerController.store);
/** Define rota PUT para editar container */
routes.put('/containers', ContainerController.update);

/** Define rota POST para criar nova ferramenta */
routes.post('/tools', ToolController.store);
/** Define rota PUT para editar dados da ferramenta */
routes.put('/tools', ToolController.update);

/** Define rota POST para criar novo equipamento */
routes.post('/equipment', EquipmentController.store);

/** Define rota PUT para editar dados do equipamento */
routes.put('/equipment', EquipmentController.update);

/** Define rota POST para criar novo laboratório */
routes.post('/labs', LabController.store);
/** Define rota PUT para editar informações de laboratório */
routes.put('/labs', LabController.update);

/** Define rota POST para criar novo agendamento */
routes.post('/bookings', BookingController.store);
/** Define rota GET para listagem de agendamentos */
routes.get('/bookings', BookingController.index);
/** Define rota DELETE para deletar agendamentos */
routes.delete('/bookings/:id', BookingController.delete);

/** Define rota POST para agendamento de serviço */
routes.post('/appointments', AppointmentController.store);
/** Define rota GET para consulta de agendamentos de serviço */
routes.get('/appointments', AppointmentController.index);
/** Define rota DELETE para cancelar agendamento */
routes.delete('/appointments/:id', AppointmentController.delete);

/** Define rota GET para consulta de notificacoes do prestador de servico */
routes.get('/notifications', NotificationController.index);
/** Define rota PUT para marcar notificacoes como lidas */
routes.put('/notifications/:id', NotificationController.update);

/** Define rota GET para listagem de usuários que são providers */
routes.get('/providers', ProviderController.index);
/** Define rota GET para listagem de agenda do equipamento */
routes.get('/equipment-schedule', EquipmentScheduleController.index);
/** Define rota GET para listagem de agenda do provider */
routes.get('/provider-schedule', ProviderScheduleController.index);
/** Define rota GET para listagem de horarios disponiveis de um provider */
routes.get('/providers/:providerId/available', AvailableController.index);

/* --------------------------------- EXPORTS ---------------------------------*/
export default routes;
