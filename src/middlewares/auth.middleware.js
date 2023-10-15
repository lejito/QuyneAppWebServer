require('dotenv').config();
const jwt = require('jsonwebtoken');
const utils = require('../controllers/utils');

module.exports = async (requiredRoles) => {
  return (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json(utils.errorResponse(
        'Acceso denegado: autenticación no proporcionada.',
        null
      ));
    } else {
      try {
        const usuario = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

        if (!requiredRoles.includes(usuario.rol)) {
          return res.status(401).json(utils.errorResponse(
            'Acceso denegado: autorización inválida.',
            null
          ));
        } else {
          next();
        }
      } catch (error) {
        return res.status(401).json(utils.errorResponse(
          'Acceso denegado: autenticación inválida.',
          null
        ));
      }
    }
  }
}