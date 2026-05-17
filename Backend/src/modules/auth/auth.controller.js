// src/modules/auth/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbRun, dbGet } = require('../../database/connection');
const { success, created, badRequest, unauthorized, error } = require('../../utils/response');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// POST /api/auth/register
async function register(req, res) {
  try {
    const { name, email, phone, password, role = 'client', specialty, category_id, bio, address, city } = req.body;

    if (!name || !email || !password) {
      return badRequest(res, 'Nome, e-mail e senha são obrigatórios');
    }
    if (!['client', 'entrepreneur'].includes(role)) {
      return badRequest(res, 'Role inválido: use "client" ou "entrepreneur"');
    }

    const existing = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) return badRequest(res, 'E-mail já cadastrado');

    const password_hash = await bcrypt.hash(password, 12);
    const result = await dbRun(
      'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), phone || null, password_hash, role]
    );
    const userId = result.lastID;

    // Se for empreendedor, cria automaticamente o perfil profissional
    if (role === 'entrepreneur') {
      // Busca primeira categoria disponível como padrão se não informada
      let catId = category_id;
      if (!catId) {
        const firstCat = await dbGet('SELECT id FROM categories LIMIT 1');
        catId = firstCat ? firstCat.id : null;
      }
      if (catId) {
        await dbRun(
          `INSERT INTO professionals (user_id, category_id, specialty, bio, address, city)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [userId, catId, specialty || name.trim(), bio || null, address || null, city || null]
        );
      }
    }

    const user = await dbGet('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?', [userId]);
    const token = generateToken(user);

    return created(res, { user, token }, 'Conta criada com sucesso!');
  } catch (err) {
    console.error('[register] Erro:', err);
    return error(res, 'Erro ao criar conta');
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return badRequest(res, 'E-mail e senha são obrigatórios');

    const user = await dbGet('SELECT * FROM users WHERE email = ? AND is_active = 1', [email.toLowerCase().trim()]);
    if (!user) return unauthorized(res, 'E-mail ou senha inválidos');

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return unauthorized(res, 'E-mail ou senha inválidos');

    const { password_hash, ...safeUser } = user;
    const token = generateToken(safeUser);

    return success(res, { user: safeUser, token }, 'Login realizado com sucesso!');
  } catch (err) {
    console.error(err);
    return error(res, 'Erro ao fazer login');
  }
}

// GET /api/auth/me
async function me(req, res) {
  try {
    const user = await dbGet(
      'SELECT id, name, email, phone, role, avatar_url, is_active, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!user) return unauthorized(res, 'Usuário não encontrado');
    return success(res, user);
  } catch (err) {
    return error(res, 'Erro ao buscar perfil');
  }
}

module.exports = { register, login, me };
