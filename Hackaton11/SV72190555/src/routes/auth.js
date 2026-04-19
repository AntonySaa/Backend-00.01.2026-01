const Router = require("express");
const {
  authLogin,
  authLogout,
  createAccount,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth");

const router = Router();

router.post("/login", authLogin);
router.post("/sign-in", createAccount);
router.post("/logout", authMiddleware, authLogout);

module.exports = router;
