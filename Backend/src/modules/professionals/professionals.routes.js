// src/modules/professionals/professionals.routes.js
const { Router } = require('express');
const { listProfessionals, getProfessional, createProfessional, updateProfessional } = require('./professionals.controller');
const { authMiddleware } = require('../../middleware/auth');

const router = Router();

router.get('/',     listProfessionals);
router.get('/:id',  getProfessional);
router.post('/',    authMiddleware, createProfessional);
router.put('/:id',  authMiddleware, updateProfessional);

module.exports = router;
