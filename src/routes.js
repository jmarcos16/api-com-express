const express = require("express");
const router = express.Router();

router.get('/', function (req, res) {
  res.send("Lista de todos usuários");
});

module.exports = router;