const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Inicio de sesión
router.post('/login', authController.login);

// Renovar access token usando refresh token
router.post('/refresh', authController.refresh);

module.exports = router;