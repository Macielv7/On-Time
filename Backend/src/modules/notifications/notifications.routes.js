// src/modules/notifications/notifications.routes.js
const { Router } = require('express');
const { listNotifications, markAsRead, markAllAsRead } = require('./notifications.controller');
const { authMiddleware } = require('../../middleware/auth');

const router = Router();

router.get('/',               authMiddleware, listNotifications);
router.put('/read-all',       authMiddleware, markAllAsRead);
router.put('/:id/read',       authMiddleware, markAsRead);

module.exports = router;
