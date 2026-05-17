// src/modules/services/services.routes.js
const { Router } = require('express');
const { listServices, getMyServices, createService, updateService, deleteService } = require('./services.controller');
const { authMiddleware } = require('../../middleware/auth');

const router = Router();

router.get('/mine',  authMiddleware, getMyServices);
router.get('/',      listServices);
router.post('/',     authMiddleware, createService);
router.put('/:id',   authMiddleware, updateService);
router.delete('/:id',authMiddleware, deleteService);

module.exports = router;
