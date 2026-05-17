// src/modules/notifications/notifications.controller.js
const { dbAll, dbRun, dbGet } = require('../../database/connection');
const { success, error, notFound, forbidden } = require('../../utils/response');

// GET /api/notifications
async function listNotifications(req, res) {
  try {
    const rows = await dbAll(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    return success(res, rows);
  } catch (err) {
    return error(res, 'Erro ao listar notificações');
  }
}

// PUT /api/notifications/:id/read
async function markAsRead(req, res) {
  try {
    const notif = await dbGet('SELECT * FROM notifications WHERE id = ?', [req.params.id]);
    if (!notif) return notFound(res, 'Notificação não encontrada');
    if (notif.user_id !== req.user.id) return forbidden(res, 'Acesso negado');
    await dbRun('UPDATE notifications SET is_read = 1 WHERE id = ?', [req.params.id]);
    return success(res, null, 'Marcada como lida');
  } catch (err) {
    return error(res, 'Erro ao atualizar notificação');
  }
}

// PUT /api/notifications/read-all
async function markAllAsRead(req, res) {
  try {
    await dbRun('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.user.id]);
    return success(res, null, 'Todas marcadas como lidas');
  } catch (err) {
    return error(res, 'Erro ao atualizar notificações');
  }
}

module.exports = { listNotifications, markAsRead, markAllAsRead };
