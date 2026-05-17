// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { unauthorized } = require('../utils/response');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorized(res, 'Token não fornecido');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return unauthorized(res, 'Token expirado');
    }
    return unauthorized(res, 'Token inválido');
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      const { forbidden } = require('../utils/response');
      return forbidden(res, `Acesso restrito a: ${roles.join(', ')}`);
    }
    next();
  };
}

module.exports = { authMiddleware, requireRole };
