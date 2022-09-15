const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

class UserController {
  async findOne(req, res) {
    /**
     * Realiza consulta de usuário no banco
     * @param int id - passado como parâmetro via url
     */

    const id = parseInt(req.params.id);
    try {
      const user = await prisma.user.findUnique({
        where: { id: id },
      });
      if (!user) {
        return res.status(404).send({ error: "Usuário não encontrado" });
      }
      return res.status(200).send(user);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "Houve um erro na pesquisa." });
    }
  }

  async findAll(req, res) {
    /**
     * Função de pesquisar todos usuários, não precisa de nunhum parâmetro.
     * @method GET
     */

    const users = await prisma.user.findMany();
    if (users) {
      return res.status(200).send(users);
    } else {
      return res.status(404).send({ error: "Nenhum usuário encontrado" });
    }
  }

  async createUser(req, res) {
    /**
     * Função de criação de usuários
     * @method POST
     * @args {name, email password, type} - todos argumentos são obrigátorios.
     * @return JSON {user}
     */

    const { name, email, password, type } = req.body;

    //Validating credentials

    if (!name) {
      return res.status(400).send({ error: "O nome deve ser informado." });
    }

    if (!email) {
      return res.status(400).send({ error: "O email deve ser informado." });
    }

    if (!type) {
      return res.status(400).send({ error: "O tipo deve ser informado." });
    }

    if (!password) {
      return res.status(400).send({ error: "Você deve fornecer uma senha." });
    }

    if (!type) {
      return res
        .status(400)
        .send({ error: "Você deve fornecer o tipo de usuário." });
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
        .json({ error: "Já existe um usuário com esse e-mail." });
    }

    try {
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

      return res
        .status(201)
        .send({ success: "Usuário cadastrado com sucesso." });
    } catch (error) {
      return res.status(500).send({ error: "Houve um erro inesperado." });
    }
  }

  async update(req, res) {
    /**
     * Função responsavel por realizar updates
     * @method PUT
     * @param int indentificador de usuário, padrão id.
     * @args aceita os argumentos da tabela.
     *
     */

    const id = parseInt(req.params.id);
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
          type: type,
        },
      });

      return res
        .status(200)
        .send({ success: "Usuário atualizado com sucesso." });
    } catch (error) {
      console.log(error);
      return res
        .status(422)
        .send({ error: "Pode ser que este e-mail já esteja em uso." });
    }
  }

  async delete(req, res) {
    /**
     * Deleta usuários do banco
     * @method DELETE
     * @param int identificador do usuário, padão id.
     */

    const id = parseInt(req.params.id);
    const validationUserExist = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!validationUserExist) {
      return res.status(404).send({ error: "Usuário inexitente." });
    }

    try {
      const user = await prisma.user.delete({
        where: {
          id: id,
        },
      });
      return res.status(200).send({ success: "Usuário deletado com sucesso." });
    } catch (error) {
      return res
        .status(500)
        .send({ error: "Houve um erro inesperado, tente novamente." });
    }
  }
}

module.exports = new UserController();
