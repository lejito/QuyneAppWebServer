const utils = require("../controllers/utils");

module.exports = (requiredParams) => {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   **/
  return (req, res, next) => {
    const missingParams = [];
    const invalidParams = [];
    const nullParams = [];

    for (const param of requiredParams) {
      if (!(param.name in req.body)) {
        missingParams.push(param);
      } else if (!param.nullable) {
        if (
          req.body[param.name] === null ||
          req.body[param.name] === undefined
        ) {
          nullParams.push(param);
        } else if (
          !param.nullable &&
          !(typeof req.body[param.name] === param.type)
        ) {
          invalidParams.push(param);
        }
      }
    }

    if (
      missingParams.length > 0 ||
      invalidParams.length > 0 ||
      nullParams.length > 0
    ) {
      return res.status(400).json(
        utils.errorResponse(
          "Los parámetros proporcionados no son los suficientes, no son del tipo válido o son nulos.",
          {
            parametrosFaltantes: missingParams,
            parametrosInvalidos: invalidParams,
            parametrosNulos: nullParams,
          }
        )
      );
    } else {
      return next();
    }
  };
};
