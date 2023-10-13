const express = require("express")

const router = express.Router()

const { AccountController } = require('../controllers');
const _AccountController = new AccountController()

router.get("/", _AccountController.findAll);
router.get("/:id", _AccountController.findOne);
router.put("/:id", _AccountController.update);
router.post("/validate", _AccountController.validate);

module.exports = router