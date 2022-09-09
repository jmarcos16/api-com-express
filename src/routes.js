const express = require("express");
const router = express.Router();
const UserController = require("./Controllers/UserController");

router.post("/user", UserController.createUser);
router.get("/users", UserController.findAll);
router.get("/user/:id", UserController.findOne);
router.put("/user/:id", UserController.update);
// router.delete("user/:id", UserController.delete);
module.exports = router;
