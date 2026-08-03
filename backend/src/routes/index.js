const { Router } = require('express');

const authRoutes = require('./auth.routes');
const barberRoutes = require('./barbers.routes');
const appointmentRoutes = require('./appointments.routes');

const routes = Router();

routes.get('/health', (req, res) => res.json({ status: 'ok' }));

routes.use('/auth', authRoutes);
routes.use('/barbers', barberRoutes);
routes.use('/appointments', appointmentRoutes);

module.exports = routes;
