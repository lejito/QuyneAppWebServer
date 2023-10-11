const express = require("express")

const router = express.Router()

const { UserController } = require('../controllers');
const _userController = new UserController()

router.get("/", _userController.findAll);
router.get("/:id", _userController.findOne)
router.post("/", _userController.create)
router.put("/:id", _userController.update)

module.exports = router