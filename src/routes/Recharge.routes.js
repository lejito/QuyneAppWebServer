const express = require("express")

const router = express.Router()

const { RechargeController } = require('../controllers');
const _RechargeController = new RechargeController()

router.post("/", _RechargeController.create)

module.exports = router