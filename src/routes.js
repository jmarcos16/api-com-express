const express = require("express");
const router = express.Router();
const UserController = require("./Controllers/UserController");

router.get("/users", UserController.createUser);

module.exports = router;