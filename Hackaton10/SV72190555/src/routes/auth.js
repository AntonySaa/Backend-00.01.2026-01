const { Router } = require("express");
const { authLogin, authLogout } = require("../controllers/auth.controller");

const router = Router();

router.post("/login", authLogin);
router.post("/logout", authLogout);

module.exports = router;
