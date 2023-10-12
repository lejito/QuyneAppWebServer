const express = require("express")

const router = express.Router()

const { InternalTransactionController } = require('../controllers');
const _InternalTransactionController = new InternalTransactionController()

router.post("/", _InternalTransactionController.create)

module.exports = router