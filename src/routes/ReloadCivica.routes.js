const express = require("express")

const router = express.Router()

const { ReloadCivicaController } = require('../controllers');
const _ReloadCivicaController = new ReloadCivicaController()

router.post("/", _ReloadCivicaController.create)

module.exports = router