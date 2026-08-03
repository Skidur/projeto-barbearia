const { Router } = require('express');

const AppointmentController = require('../app/controllers/AppointmentController');
const authMiddleware = require('../app/middlewares/auth');

const routes = Router();

routes.post('/', authMiddleware, AppointmentController.create);

module.exports = routes;
