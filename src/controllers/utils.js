/*
En este archivo se define el formato de respuestas JSON.

Una respuesta contiene las siguientes propiedades.
- type (string): Puede ser "success" si la respuesta es satisfactoria, "warning" si no hubo error pero no se obtuvo la respuesta esperada,
    y "error" si ocurrió un error al intentar procesar la respuesta.

- message (string): Es un string con una explicación básica de la respuesta obtenida.

- data (object/array): Contiene un objeto (o listas de objetos) dependiendo de la respuesta dada.

- error (boolean): Es "true" o "false" dependiendo de si al procesar la respuesta hubo un error.

- time (Date): Es la fecha y hora en la que se emitió la respuesta.

Adicionalmente, también se define una función que sirve para verificar si los parámetros de una petición son los requeridos.
*/

function createResponse(type, message, data, error) {
  return {
    type,
    message,
    data,
    error,
    time: new Date()
  };
};

function createResponseRequired(baseResponse, requiredParams) {
  return { ...baseResponse, requiredParams }
}

module.exports = {
  successResponse(message, data) {
    return createResponse("success", message, data, false);
  },

  warningResponse(message, data) {
    return createResponse("warning", message, data, false);
  },

  errorResponse(message, data) {
    return createResponse("error", message, data, true);
  },

  createParam(name, type, nullable) {
    return { name, type, nullable };
  },

  validateBody(req, res, requiredParams) {
    const missingParams = [];
    const invalidParams = [];
    const nullParams = [];

    for (const param of requiredParams) {
      if (!(param.name in req.body)) {
        missingParams.push(param);
      } else if (!param.nullable) {
        if (req.body[param.name] === null || req.body[param.name] === undefined) {
          nullParams.push(param);
        } else if (!(typeof req.body[param.name] === param.type)) {
          invalidParams.push(param);
        }
      }
    }

    if (missingParams.length > 0 || invalidParams.length > 0 || nullParams.length > 0) {
      res.status(400).json(createResponseRequired(
        this.errorResponse(
          'Los datos proporcionados no son los suficientes, son nulos o no son del tipo válido.',
          null
        ),
        { missingParams, nullParams, invalidParams }
      ));
      return false;
    } else {
      return true;
    }
  },

  convertSnakeToCamel(obj) {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
  
    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertSnakeToCamel(item));
    }
  
    const camelCaseObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const camelKey = key.replace(/_./g, (match) => match.charAt(1).toUpperCase());
        camelCaseObj[camelKey] = obj[key];
      }
    }
  
    return camelCaseObj;
  }
  


}