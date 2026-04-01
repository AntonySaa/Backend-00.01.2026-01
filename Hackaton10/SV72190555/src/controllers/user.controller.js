const { User } = require("../models");

const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await User.create({ firstName, lastName, email, passwordHash: password });
    const created = await User.findByPk(user.id);
    return res.status(201).json({ status: "ok", data: created });
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser };
