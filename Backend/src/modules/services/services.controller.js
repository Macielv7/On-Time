// src/modules/services/services.controller.js
const jwt = require('jsonwebtoken');
const { dbAll, dbGet, dbRun } = require('../../database/connection');
const { success, created, notFound, error, badRequest, forbidden } = require('../../utils/response');

// GET /api/services?professional_id= OR ?mine=1 (requer Authorization header)
async function listServices(req, res) {
  try {
    const { professional_id, mine } = req.query;

    // Se mine=1, tenta pegar pelo JWT do header (sem obrigar autenticação)
    if (mine === '1') {
      const authHeader = req.headers.authorization;
      if (!authHeader) return success(res, []);
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const pro = await dbGet('SELECT * FROM professionals WHERE user_id = ?', [decoded.id]);
        if (!pro) return success(res, []);
        const rows = await dbAll('SELECT * FROM services WHERE professional_id = ? AND is_active = 1 ORDER BY name', [pro.id]);
        return success(res, rows);
      } catch {
        return success(res, []);
      }
    }

    let sql = 'SELECT * FROM services WHERE is_active = 1';
    const params = [];
    if (professional_id) { sql += ' AND professional_id = ?'; params.push(professional_id); }
    sql += ' ORDER BY name';
    const rows = await dbAll(sql, params);
    return success(res, rows);
  } catch (err) {
    return error(res, 'Erro ao listar serviços');
  }
}

async function getOwnerProfessional(userId) {
  return dbGet('SELECT * FROM professionals WHERE user_id = ?', [userId]);
}

// GET /api/services/mine  (empreendedor autenticado)
async function getMyServices(req, res) {
  try {
    const pro = await getOwnerProfessional(req.user.id);
    if (!pro) return success(res, []);
    const rows = await dbAll(
      'SELECT * FROM services WHERE professional_id = ? AND is_active = 1 ORDER BY name',
      [pro.id]
    );
    return success(res, rows);
  } catch (err) {
    return error(res, 'Erro ao listar seus serviços');
  }
}

// POST /api/services
async function createService(req, res) {
  try {
    let pro = await getOwnerProfessional(req.user.id);
    if (!pro) {
      // Perfil profissional não existe — cria automaticamente com categoria padrão
      const firstCat = await dbGet('SELECT id FROM categories LIMIT 1');
      if (!firstCat) {
        return forbidden(res, 'Nenhuma categoria cadastrada. Contate o suporte.');
      }
      const user = await dbGet('SELECT name FROM users WHERE id = ?', [req.user.id]);
      await dbRun(
        `INSERT INTO professionals (user_id, category_id, specialty) VALUES (?, ?, ?)`,
        [req.user.id, firstCat.id, user ? user.name : 'Profissional']
      );
      pro = await getOwnerProfessional(req.user.id);
    }
    if (!pro) {
      return forbidden(res, 'Não foi possível criar perfil profissional. Tente novamente.');
    }

    const { name, description, price, duration_min, image_url } = req.body;
    if (!name || price == null || !duration_min) {
      return badRequest(res, 'name, price e duration_min são obrigatórios');
    }

    const result = await dbRun(
      'INSERT INTO services (professional_id, name, description, price, duration_min, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [pro.id, name.trim(), description || null, parseFloat(price), parseInt(duration_min), image_url || null]
    );
    const svc = await dbGet('SELECT * FROM services WHERE id = ?', [result.lastID]);
    return created(res, svc, 'Serviço criado!');
  } catch (err) {
    console.error('[createService] Erro:', err);
    return error(res, 'Erro ao criar serviço: ' + (err.message || 'erro desconhecido'));
  }
}

// PUT /api/services/:id
async function updateService(req, res) {
  try {
    const pro = await getOwnerProfessional(req.user.id);
    if (!pro) return forbidden(res, 'Acesso negado');

    const svc = await dbGet('SELECT * FROM services WHERE id = ? AND professional_id = ?', [req.params.id, pro.id]);
    if (!svc) return notFound(res, 'Serviço não encontrado');

    const { name, description, price, duration_min, image_url } = req.body;
    await dbRun(
      `UPDATE services SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        price = COALESCE(?, price),
        duration_min = COALESCE(?, duration_min),
        image_url = COALESCE(?, image_url),
        updated_at = datetime('now')
       WHERE id = ?`,
      [name, description, price != null ? parseFloat(price) : null, duration_min != null ? parseInt(duration_min) : null, image_url, req.params.id]
    );
    const updated = await dbGet('SELECT * FROM services WHERE id = ?', [req.params.id]);
    return success(res, updated, 'Serviço atualizado!');
  } catch (err) {
    console.error('[updateService] Erro:', err);
    return error(res, 'Erro ao atualizar serviço');
  }
}

// DELETE /api/services/:id  (soft delete)
async function deleteService(req, res) {
  try {
    const pro = await getOwnerProfessional(req.user.id);
    if (!pro) return forbidden(res, 'Acesso negado');

    const svc = await dbGet('SELECT * FROM services WHERE id = ? AND professional_id = ?', [req.params.id, pro.id]);
    if (!svc) return notFound(res, 'Serviço não encontrado');

    await dbRun('UPDATE services SET is_active = 0, updated_at = datetime(\'now\') WHERE id = ?', [req.params.id]);
    return success(res, null, 'Serviço removido!');
  } catch (err) {
    console.error('[deleteService] Erro:', err);
    return error(res, 'Erro ao remover serviço');
  }
}

module.exports = { listServices, getMyServices, createService, updateService, deleteService };
