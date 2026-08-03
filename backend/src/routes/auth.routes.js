const { Router } = require('express');

const AuthController = require('../app/controllers/AuthController');

const routes = Router();

routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);

module.exports = routes;
