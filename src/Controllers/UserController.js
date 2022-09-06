const express = require("express");

class UserController {
  async createUser(req, res) {
    res.json({ "user": "dwuiduiawn" });
  }
}

module.exports = new UserController;