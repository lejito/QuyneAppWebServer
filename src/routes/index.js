const express = require("express");
const router = express.Router();

const usuariosRouter = require("./usuarios.router");
const cuentasRouter = require("./cuentas.router");

router.use("/usuarios", usuariosRouter);
router.use("/cuentas", cuentasRouter);

module.exports = router;
