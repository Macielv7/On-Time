// src/utils/response.js
// Padroniza todas as respostas da API

function success(res, data, message = 'Sucesso', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function created(res, data, message = 'Criado com sucesso') {
  return success(res, data, message, 201);
}

function error(res, message = 'Erro interno', statusCode = 500, errors = null) {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
}

function notFound(res, message = 'Recurso não encontrado') {
  return error(res, message, 404);
}

function unauthorized(res, message = 'Não autorizado') {
  return error(res, message, 401);
}

function forbidden(res, message = 'Acesso negado') {
  return error(res, message, 403);
}

function badRequest(res, message = 'Dados inválidos', errors = null) {
  return error(res, message, 400, errors);
}

module.exports = { success, created, error, notFound, unauthorized, forbidden, badRequest };
