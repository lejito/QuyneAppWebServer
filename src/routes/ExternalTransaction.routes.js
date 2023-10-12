const express = require("express")

const router = express.Router()

const { ExternalTransactionController } = require('../controllers');
const _ExternalTransactionController = new ExternalTransactionController()

router.post("/", _ExternalTransactionController.create)

module.exports = router