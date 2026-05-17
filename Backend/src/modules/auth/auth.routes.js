// src/modules/auth/auth.routes.js
const { Router } = require('express');
const { register, login, me } = require('./auth.controller');
const { authMiddleware } = require('../../middleware/auth');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, me);

module.exports = router;
