const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

class UserController {
  async findOne(req, res) {
    const id = req.params.id;

    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      return res.status(404).send({ error: "Usuário não encontrado" });
    }
    return res.status(200).send(user);
  }

  async findAll(req, res) {
    const users = await prisma.user.findMany();

    if (users) {
      return res.status(200).send(users);
    } else {
      return res.status(404).send({ error: "Nenhum usuário encontrado" });
    }
  }

  async createUser(req, res) {
    const { name, email, password, type } = req.body;

    //Validating credentials

    if (!email) {
      return res.status(400).send({ error: "O email deve ser informado" });
    }

    if (!password) {
      return res.status(400).send({ error: "Você deve fornecer uma senha" });
    }

    if (!type) {
      return res
        .status(400)
        .send({ error: "Você deve fornecer o tipo de usuário" });
    }

    //Validating if user exists
    const findUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (findUser) {
      return res
        .status(422)
        .json({ error: "A user with that username already exists" });
    }

    //Caso não exista usuário cria

    const salt = await bcrypt.genSalt(8);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        type,
      },
    });

    return res.status(201).send({ success: "User registered successfully", user });
  }


  async update(req, res) {
    const id = req.params.id;
    const { name, email, password, type } = req.body;

    // Verifica se usuário existe

    const userExist = await prisma.user.findUnique({ where: { id: id } });

    if (!userExist) {
      return res.status(404).send({ error: "Usuário não encontrado" });
    }

    try {
      const salt = await bcrypt.genSalt(8);
      const passwordHash = await bcrypt.hash(password, salt);

      const updateUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          email: email,
          password: passwordHash,
          type: type
        },
      });

      return res.status(200).send({ success: "Usuário atualizado com sucesso.", updateUser });

    } catch (error) {
      console.log(error);
      return res.status(422).send({ error: "Pode ser que este e-mail já esteja em uso." });
    }
  }

  async delete(req, res) {
    const id = req.params.id;
    const validationUserExist = await prisma.user.findUnique({ where: { id: id } });

    if (!validationUserExist) {
      return res.status(404).send({ error: "Usuário inexitente." });
    }

    try {
      const user = await prisma.user.delete({
        where: {
          id: id
        }
      });
      return res.status(200).send({ success: "Usuário deletado com sucesso." });
    } catch (error) {

      return res.status(500).send({ error: "Houve um erro inesperado, tente novamente." });
      console.log(error);
    }

  }

}

module.exports = new UserController();
