import { Router } from "express";
import {
  authLogin,
  authLogout,
  createAccount,
  uploadAvatar,
} from "../controllers/auth.controller.ts";
import { authMiddleware } from "../middlewares/auth.ts";
import { uploadAvatar as multerUpload } from "../middlewares/multer.ts";

const router = Router();

router.post("/login", authLogin);
router.post("/sign-in", createAccount);
router.post("/logout", authLogout);
router.post(
  "/avatar",
  authMiddleware,
  multerUpload.single("avatar"),
  uploadAvatar,
);

export default router;
