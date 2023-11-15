require("dotenv").config();
const jwt = require("jsonwebtoken");
const utils = require("../controllers/utils");

module.exports =
  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      res
        .status(401)
        .json(
          utils.errorResponse(
            "Acceso denegado: autenticación no proporcionada.",
            null
          )
        );
    } else {
      try {
        jwt.verify(token, process.env.SECRETJWT);
        next();
      } catch (error) {
        res
          .status(401)
          .json(
            utils.errorResponse(
              "Acceso denegado: autenticación inválida o expirada.",
              null
            )
          );
      }
    }
  };
