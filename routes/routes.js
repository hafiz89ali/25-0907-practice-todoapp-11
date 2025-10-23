import { Router } from "express";
import healthController from "../controller/health.js";
import authController from "../controller/auth.js";

const router = Router();

router.get("/", healthController.getHealth);
router.post("/", healthController.postHealth);
router.post("/register", authController.registerUsers);
router.post("/login", authController.loginUser);

export default router;
