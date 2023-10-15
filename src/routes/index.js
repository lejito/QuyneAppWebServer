const express = require("express");
const router = express.Router();

const usuariosRouter = require("./usuarios.router");

router.use("/usuarios", usuariosRouter);

module.exports = router;
