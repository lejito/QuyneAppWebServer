const express = require("express")

const router = express.Router()

const { BillController } = require('../controllers');
const _BillController = new BillController()

router.post("/", _BillController.create)

module.exports = router