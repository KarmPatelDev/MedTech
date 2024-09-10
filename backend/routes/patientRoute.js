import express from "express";
import { requireSignIn, isPatient, isDoctor } from "../middlewares/authMiddleware.js";
import { registerController, loginController, logoutController, updateProfileController, getPatientBySlugController, getPatientController } from "../controllers/patientController.js";

// Router Object
const router = express.Router();

// Register
router.post("/register", registerController);

// Login
router.post("/login", loginController);

// Logout
router.get("/logout", requireSignIn, logoutController);

// Update-Profile
router.put("/update-profile", requireSignIn, isPatient, updateProfileController);

router.get("/get-patient-detail/:slug", requireSignIn, isDoctor, getPatientBySlugController);

router.get("/get-profile-detail/:slug", requireSignIn, isPatient, getPatientController);

// protect
router.get("/auth", requireSignIn, isPatient, (req, res) => {
    res.status(200).send({ok: req.ok});
});
export default router;