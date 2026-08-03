const { Router } = require('express');

const BarberController = require('../app/controllers/BarberController');

const routes = Router();

routes.get('/', BarberController.list);
routes.get('/:barberId/services', BarberController.listServices);
routes.get('/:barberId/availability', BarberController.getAvailability);

module.exports = routes;
