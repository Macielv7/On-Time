// src/modules/professionals/professionals.controller.js
const { dbAll, dbGet, dbRun } = require('../../database/connection');
const { success, created, notFound, error, badRequest } = require('../../utils/response');

// GET /api/professionals?category_id=&city=&search=
async function listProfessionals(req, res) {
  try {
    const { category_id, city, search } = req.query;
    let sql = `
      SELECT
        p.id, p.bio, p.specialty, p.address, p.city,
        p.rating_avg, p.rating_count, p.is_accepting,
        u.id AS user_id, u.name, u.email, u.phone, u.avatar_url,
        c.id AS category_id, c.name AS category_name, c.icon, c.color
      FROM professionals p
      JOIN users u ON u.id = p.user_id
      JOIN categories c ON c.id = p.category_id
      WHERE p.is_accepting = 1 AND u.is_active = 1
    `;
    const params = [];

    if (category_id) { sql += ' AND p.category_id = ?'; params.push(category_id); }
    if (city)        { sql += ' AND LOWER(p.city) LIKE ?'; params.push(`%${city.toLowerCase()}%`); }
    if (search)      { sql += ' AND (LOWER(u.name) LIKE ? OR LOWER(p.specialty) LIKE ?)'; params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`); }

    sql += ' ORDER BY p.rating_avg DESC';

    const rows = await dbAll(sql, params);
    return success(res, rows);
  } catch (err) {
    console.error(err);
    return error(res, 'Erro ao listar profissionais');
  }
}

// GET /api/professionals/:id
async function getProfessional(req, res) {
  try {
    const { id } = req.params;
    const pro = await dbGet(`
      SELECT
        p.*, u.name, u.email, u.phone, u.avatar_url,
        c.name AS category_name, c.icon, c.color
      FROM professionals p
      JOIN users u ON u.id = p.user_id
      JOIN categories c ON c.id = p.category_id
      WHERE p.id = ?
    `, [id]);

    if (!pro) return notFound(res, 'Profissional não encontrado');

    const services = await dbAll(
      'SELECT * FROM services WHERE professional_id = ? AND is_active = 1 ORDER BY name',
      [id]
    );
    const reviews = await dbAll(`
      SELECT r.*, u.name AS client_name, u.avatar_url AS client_avatar
      FROM reviews r
      JOIN users u ON u.id = r.client_id
      WHERE r.professional_id = ?
      ORDER BY r.created_at DESC
      LIMIT 20
    `, [id]);
    const slots = await dbAll(
      'SELECT * FROM availability_slots WHERE professional_id = ? AND is_active = 1 ORDER BY day_of_week, start_time',
      [id]
    );

    return success(res, { ...pro, services, reviews, availability_slots: slots });
  } catch (err) {
    console.error(err);
    return error(res, 'Erro ao buscar profissional');
  }
}

// POST /api/professionals
async function createProfessional(req, res) {
  try {
    const { category_id, specialty, bio, address, city, latitude, longitude } = req.body;
    if (!category_id || !specialty) return badRequest(res, 'category_id e specialty são obrigatórios');

    const existing = await dbGet('SELECT id FROM professionals WHERE user_id = ?', [req.user.id]);
    if (existing) return badRequest(res, 'Perfil profissional já existe para este usuário');

    const result = await dbRun(
      `INSERT INTO professionals (user_id, category_id, specialty, bio, address, city, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, category_id, specialty, bio || null, address || null, city || null, latitude || null, longitude || null]
    );

    // Atualizar role do usuário para entrepreneur
    await dbRun('UPDATE users SET role = ? WHERE id = ?', ['entrepreneur', req.user.id]);

    const pro = await dbGet('SELECT * FROM professionals WHERE id = ?', [result.lastID]);
    return created(res, pro, 'Perfil profissional criado!');
  } catch (err) {
    console.error(err);
    return error(res, 'Erro ao criar perfil profissional');
  }
}

// PUT /api/professionals/:id
async function updateProfessional(req, res) {
  try {
    const { id } = req.params;
    const pro = await dbGet('SELECT * FROM professionals WHERE id = ?', [id]);
    if (!pro) return notFound(res, 'Profissional não encontrado');
    if (pro.user_id !== req.user.id) return res.status(403).json({ success: false, message: 'Acesso negado' });

    const { specialty, bio, address, city, is_accepting, category_id } = req.body;
    await dbRun(
      `UPDATE professionals SET
        specialty = COALESCE(?, specialty),
        bio = COALESCE(?, bio),
        address = COALESCE(?, address),
        city = COALESCE(?, city),
        is_accepting = COALESCE(?, is_accepting),
        category_id = COALESCE(?, category_id),
        updated_at = datetime('now')
       WHERE id = ?`,
      [specialty, bio, address, city, is_accepting, category_id, id]
    );
    const updated = await dbGet('SELECT * FROM professionals WHERE id = ?', [id]);
    return success(res, updated, 'Perfil atualizado!');
  } catch (err) {
    return error(res, 'Erro ao atualizar profissional');
  }
}

module.exports = { listProfessionals, getProfessional, createProfessional, updateProfessional };
