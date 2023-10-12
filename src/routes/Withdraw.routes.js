const express = require("express")

const router = express.Router()

const { WithdrawController } = require('../controllers');
const _WithdrawController = new WithdrawController()

router.post("/", _WithdrawController.create)

module.exports = router