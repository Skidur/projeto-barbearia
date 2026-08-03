const { Router } = require('express');

const AppointmentController = require('../app/controllers/AppointmentController');
const authMiddleware = require('../app/middlewares/auth');

const routes = Router();

routes.post('/', authMiddleware, AppointmentController.create);
routes.get('/me', authMiddleware, AppointmentController.listMine);
routes.delete('/:id', authMiddleware, AppointmentController.cancel);

module.exports = routes;
