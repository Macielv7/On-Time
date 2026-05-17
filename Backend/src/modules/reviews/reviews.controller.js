// src/modules/reviews/reviews.controller.js
const { dbGet, dbRun, dbAll } = require('../../database/connection');
const { success, created, badRequest, notFound, forbidden, error } = require('../../utils/response');

// POST /api/reviews
async function createReview(req, res) {
  try {
    const { appointment_id, rating, comment } = req.body;
    if (!appointment_id || !rating) return badRequest(res, 'appointment_id e rating são obrigatórios');
    if (rating < 1 || rating > 5) return badRequest(res, 'Rating deve ser entre 1 e 5');

    const appt = await dbGet('SELECT * FROM appointments WHERE id = ? AND client_id = ?', [appointment_id, req.user.id]);
    if (!appt) return notFound(res, 'Agendamento não encontrado');
    if (appt.status !== 'completed') return badRequest(res, 'Só é possível avaliar atendimentos concluídos');

    const existing = await dbGet('SELECT id FROM reviews WHERE appointment_id = ?', [appointment_id]);
    if (existing) return badRequest(res, 'Este atendimento já foi avaliado');

    const result = await dbRun(
      'INSERT INTO reviews (appointment_id, client_id, professional_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [appointment_id, req.user.id, appt.professional_id, parseInt(rating), comment || null]
    );

    // Atualizar rating médio do profissional
    const avg = await dbGet('SELECT AVG(rating) AS avg, COUNT(*) AS cnt FROM reviews WHERE professional_id = ?', [appt.professional_id]);
    await dbRun('UPDATE professionals SET rating_avg = ?, rating_count = ?, updated_at = datetime(\'now\') WHERE id = ?',
      [parseFloat(avg.avg.toFixed(1)), avg.cnt, appt.professional_id]);

    const review = await dbGet('SELECT * FROM reviews WHERE id = ?', [result.lastID]);
    return created(res, review, 'Avaliação publicada!');
  } catch (err) {
    console.error(err);
    return error(res, 'Erro ao criar avaliação');
  }
}

// GET /api/reviews?professional_id=
async function listReviews(req, res) {
  try {
    const { professional_id } = req.query;
    if (!professional_id) return badRequest(res, 'professional_id é obrigatório');
    const rows = await dbAll(
      `SELECT r.*, u.name AS client_name, u.avatar_url AS client_avatar
       FROM reviews r JOIN users u ON u.id = r.client_id
       WHERE r.professional_id = ? ORDER BY r.created_at DESC`,
      [professional_id]
    );
    return success(res, rows);
  } catch (err) {
    return error(res, 'Erro ao listar avaliações');
  }
}

module.exports = { createReview, listReviews };
