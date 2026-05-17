// src/modules/appointments/appointments.controller.js
const { dbAll, dbGet, dbRun } = require('../../database/connection');
const { success, created, notFound, error, badRequest, forbidden } = require('../../utils/response');

// GET /api/appointments — lista do usuário logado (cliente ou pro)
async function listAppointments(req, res) {
  try {
    const { status } = req.query;
    const isClient = req.user.role === 'client';

    let sql, params;
    if (isClient) {
      sql = `
        SELECT a.*,
          u.name AS professional_name, u.avatar_url AS professional_avatar,
          s.name AS service_name, s.duration_min
        FROM appointments a
        JOIN professionals p ON p.id = a.professional_id
        JOIN users u ON u.id = p.user_id
        JOIN services s ON s.id = a.service_id
        WHERE a.client_id = ?
      `;
      params = [req.user.id];
    } else {
      const pro = await dbGet('SELECT id FROM professionals WHERE user_id = ?', [req.user.id]);
      if (!pro) return success(res, []);
      sql = `
        SELECT a.*,
          u.name AS client_name, u.avatar_url AS client_avatar,
          s.name AS service_name, s.duration_min
        FROM appointments a
        JOIN users u ON u.id = a.client_id
        JOIN services s ON s.id = a.service_id
        WHERE a.professional_id = ?
      `;
      params = [pro.id];
    }

    if (status) { sql += ' AND a.status = ?'; params.push(status); }
    sql += ' ORDER BY a.scheduled_date DESC, a.scheduled_time DESC';

    const rows = await dbAll(sql, params);
    return success(res, rows);
  } catch (err) {
    console.error(err);
    return error(res, 'Erro ao listar agendamentos');
  }
}

// POST /api/appointments
async function createAppointment(req, res) {
  try {
    const { professional_id, service_id, scheduled_date, scheduled_time, payment_method, notes } = req.body;
    if (!professional_id || !service_id || !scheduled_date || !scheduled_time) {
      return badRequest(res, 'professional_id, service_id, scheduled_date e scheduled_time são obrigatórios');
    }

    const service = await dbGet('SELECT * FROM services WHERE id = ? AND professional_id = ? AND is_active = 1', [service_id, professional_id]);
    if (!service) return notFound(res, 'Serviço não encontrado');

    // Verificar conflito de horário
    const conflict = await dbGet(`
      SELECT id FROM appointments
      WHERE professional_id = ?
        AND scheduled_date = ?
        AND scheduled_time = ?
        AND status NOT IN ('cancelled')
    `, [professional_id, scheduled_date, scheduled_time]);
    if (conflict) return badRequest(res, 'Horário já reservado. Escolha outro horário.');

    const result = await dbRun(
      `INSERT INTO appointments (client_id, professional_id, service_id, scheduled_date, scheduled_time, payment_method, total_price, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, professional_id, service_id, scheduled_date, scheduled_time, payment_method || null, service.price, notes || null]
    );

    // Criar notificação para o profissional
    const pro = await dbGet('SELECT user_id, specialty FROM professionals WHERE id = ?', [professional_id]);
    if (pro) {
      await dbRun(
        `INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [pro.user_id, 'booking', 'Novo Agendamento!', `Você recebeu um novo agendamento para ${service.name} em ${scheduled_date} às ${scheduled_time}.`, result.lastID, 'appointment']
      );
    }

    const appt = await dbGet('SELECT * FROM appointments WHERE id = ?', [result.lastID]);
    return created(res, appt, 'Agendamento criado com sucesso!');
  } catch (err) {
    console.error(err);
    return error(res, 'Erro ao criar agendamento');
  }
}

// PUT /api/appointments/:id/status
async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) return badRequest(res, `Status inválido. Use: ${validStatuses.join(', ')}`);

    const appt = await dbGet('SELECT * FROM appointments WHERE id = ?', [id]);
    if (!appt) return notFound(res, 'Agendamento não encontrado');

    // Verificar permissão: cliente só pode cancelar, empreendedor pode tudo
    const isClient = appt.client_id === req.user.id;
    const pro = await dbGet('SELECT * FROM professionals WHERE id = ?', [appt.professional_id]);
    const isOwner = pro && pro.user_id === req.user.id;

    if (!isClient && !isOwner) return forbidden(res, 'Acesso negado');
    if (isClient && status !== 'cancelled') return forbidden(res, 'Clientes só podem cancelar agendamentos');

    const cancelFields = status === 'cancelled' ? ', cancelled_by = ?, cancelled_at = datetime(\'now\')' : '';
    const params = [status];
    if (status === 'cancelled') params.push(req.user.id);
    params.push(id);

    await dbRun(`UPDATE appointments SET status = ?, updated_at = datetime('now')${cancelFields} WHERE id = ?`, params);

    // Notificação
    const notifyUserId = isOwner ? appt.client_id : (pro ? pro.user_id : null);
    if (notifyUserId) {
      const msgs = {
        confirmed: ['Agendamento Confirmado!', 'Seu agendamento foi confirmado pelo profissional.'],
        completed: ['Atendimento Concluído', 'Seu atendimento foi concluído. Que tal avaliar?'],
        cancelled: ['Agendamento Cancelado', 'Um agendamento foi cancelado.'],
      };
      if (msgs[status]) {
        await dbRun(
          `INSERT INTO notifications (user_id, type, title, message, related_id, related_type) VALUES (?, ?, ?, ?, ?, ?)`,
          [notifyUserId, status === 'cancelled' ? 'cancellation' : 'confirmation', msgs[status][0], msgs[status][1], id, 'appointment']
        );
      }
    }

    // Atualizar rating se completado e tiver review
    if (status === 'completed' && pro) {
      const avg = await dbGet('SELECT AVG(rating) AS avg, COUNT(*) AS cnt FROM reviews WHERE professional_id = ?', [pro.id]);
      if (avg) await dbRun('UPDATE professionals SET rating_avg = ?, rating_count = ? WHERE id = ?', [avg.avg || 0, avg.cnt, pro.id]);
    }

    const updated = await dbGet('SELECT * FROM appointments WHERE id = ?', [id]);
    return success(res, updated, 'Status atualizado!');
  } catch (err) {
    console.error(err);
    return error(res, 'Erro ao atualizar status');
  }
}

module.exports = { listAppointments, createAppointment, updateStatus };
