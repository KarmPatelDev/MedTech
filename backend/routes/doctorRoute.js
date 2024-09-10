import express from "express";
import { requireSignIn, isAdmin, isDoctor } from "../middlewares/authMiddleware.js";
import { registerController, loginController, logoutController, updateProfileController, updateApprovalStatusController, getDoctorPhotoController, getCertificatePhotoController, getDoctorsListController, getDoctorsByCategoryController, getDoctorBySlugController, getDoctorsCountController, searchDoctorsController } from "../controllers/doctorController.js";
import formidable from "express-formidable";

// Router Object
const router = express.Router();

// Register
router.post("/register", formidable(), registerController);

// Login
router.post("/login", loginController);

// Logout
router.get("/logout", requireSignIn, logoutController);

// Update-Profile
router.put("/update-profile", requireSignIn, isDoctor, formidable(), updateProfileController);

// Update-Approval
router.put("/update-approval/:id", requireSignIn, isAdmin, updateApprovalStatusController);

// get-photo
router.get("/get-doctor-photo/:id", getDoctorPhotoController);

// get-certificate
router.get("/get-doctor-certificate-photo/:id", getCertificatePhotoController);

// get-doctors
router.get("/get-doctors-list", getDoctorsListController);

// get-doctors-by-category
router.get("/get-doctors/:slug", getDoctorsByCategoryController);

// get-doctor-by-username
router.get("/get-doctor/:slug", getDoctorBySlugController);

// get-doctors-count
router.get("/get-doctors-count", getDoctorsCountController);

// get-doctors-search
router.get("/search-doctors/:keyword", searchDoctorsController);

// protect
router.get("/auth", requireSignIn, isDoctor, (req, res) => {
    res.status(200).send({ok: req.ok});
});

export default router;