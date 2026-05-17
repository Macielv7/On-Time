// src/modules/appointments/appointments.routes.js
const { Router } = require('express');
const { listAppointments, createAppointment, updateStatus } = require('./appointments.controller');
const { authMiddleware } = require('../../middleware/auth');

const router = Router();

router.get('/',              authMiddleware, listAppointments);
router.post('/',             authMiddleware, createAppointment);
router.put('/:id/status',    authMiddleware, updateStatus);

module.exports = router;
