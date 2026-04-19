const { appError } = require("../middlewares/errorHandler");
const User = require("../models/User");
const { passEncrypt, comparePass } = require("../utils/encriptar");
const { generateToken } = require("../utils/jwt.handle");

const tokenBlackList = new Set();

const authLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userFind = await User.findOne({ email: email }).select("+password");

    if (!userFind) {
      return next(
        appError(400, "USER_NOT_FOUND", "el usuario no ha sido encontrado")
      );
    }

    const isCorrect = await comparePass(password, userFind.password);
    if (!isCorrect) {
      return next(
        appError(400, "USER_NOT_FOUND", "las credenciales ingresadas son incorrectas")
      );
    }

    const token = generateToken(userFind._id);
    return res.status(201).json({ status: "ok", data: token });
  } catch (error) {
    next(error);
  }
};

const authLogout = (req, res, next) => {
  try {
    let token = null;
    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (token) {
      tokenBlackList.add(token);
    }
    return res.status(201).json({ status: "ok", message: "Sesion cerrada correctamente" });
  } catch (error) {
    next(error);
  }
};

const createAccount = async (req, res, next) => {
  try {
    const { email, password, rol } = req.body;

    const hashPass = await passEncrypt(password);

    const userCreated = await User.create({ email, password: hashPass, rol });

    const userFind = await User.findOne(userCreated._id);

    return res.status(200).json(userFind);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authLogin,
  authLogout,
  tokenBlackList,
  createAccount,
};
