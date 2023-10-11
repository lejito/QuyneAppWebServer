const express = require("express")

const router = express.Router()

const { TransactionController } = require('../controllers');
const _TransactionController = new TransactionController()

router.get("/:id", _TransactionController.findAllByAccount);

module.exports = router

