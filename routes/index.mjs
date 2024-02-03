import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  checkExistUser,
  getPublicKeyFromUsername
} from "../controllers/userController.mjs";
import {
  recordMessage,
  getMessage
} from "../controllers/messageController.mjs";
import { authenticate } from "../middlewares/auth.mjs";

const router = express.Router();

router.route("/").post(createUser);
router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);
router.post("/checkExistUser", checkExistUser);
router.post("/getPublicKey", authenticate, getPublicKeyFromUsername);
router.post("/recordMessage", recordMessage);
router.post("/getMessage", getMessage);

export default router;
