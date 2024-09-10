import express from "express";
import { requireSignIn, isDoctor } from "../middlewares/authMiddleware.js";
import { chatgptController } from "../controllers/chatgptController.js";

const router = express.Router();

router.post("/chatgpt", requireSignIn, isDoctor, chatgptController);

export default router;