import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import { registerController, loginController, logoutController, updateProfileController } from "../controllers/adminController.js";

// Router Object
const router = express.Router();

// Register
router.post("/register", registerController);

// Login
router.post("/login", loginController);

// Logout
router.get("/logout", requireSignIn, logoutController);

// Update-Profile
router.put("/update-profile", requireSignIn, isAdmin, updateProfileController);

// protect
router.get("/auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ok: req.ok});
});

export default router;