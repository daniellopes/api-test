const User = require("../models/User");
const generateToken = require("../utils/generateToken");

module.exports = {
  async create(req, res) {
    const { name, email, cpf, password } = req.body;
    const userExists = await User.findOne({ cpf });

    if (userExists) {
      res.status(400).json("Usuário já existe!!");
    }
    try {
      const user = await User.create({
        name,
        email,
        cpf,
        password,
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json(error);
    }
  },
  async login(req, res) {
    const { cpf, password } = req.body;
    const user = await User.findOne({ cpf });
    if (!user) {
      res.status(400).json("Usuário não existe!!");
    }

    if (await user.matchPassword(password)) {
      res.status(200).json({
        user: {
          _id: user._id,
          name: user.name,
          cpf: user.cpf,
          email: user.email
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json("E-mail ou senha inválidos");
    }
  },
  async changePass(req, res) {
    const { cpf, email } = req.body;
    const user = await User.findOne({ cpf });
    if (!user) {
      res.status(400).json("Usuário não existe!!");
    }

    if (user) {
      res.header("Access-Control-Allow-Origin", "https://change-password.hsmedsaude.com");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.status(200).json({
        user: {
          _id: user._id,
          name: user.name,
          cpf: user.cpf,
          email: user.email
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json("Dados inválidos");
    }
  },
  async update(req, res) {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(400).json("Usuário não existe!!");
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;

    try {
      const updateUser = await user.save();
      res.status(201).json(updateUser);
    } catch (error) {
      res.status(400).json(error);
    }
  },
};
