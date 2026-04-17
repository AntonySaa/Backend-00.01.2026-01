const { sign, verify } = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (id) => {
  return sign({ id }, JWT_SECRET, { expiresIn: "2h" });
};

const verifyToken = (jwt) => {
  return verify(jwt, JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
