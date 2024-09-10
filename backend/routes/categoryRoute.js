import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createCategoryController, deleteCategoryController, updateCategoryController, getCategoryController, getCategoriesController, searchCategoriesController, getCategoryPhotoController } from "../controllers/categoryController.js";
import formidable from "express-formidable";

// Router Object
const router = express.Router();

// Routing 

// Create Category
router.post('/create-category', requireSignIn, isAdmin, formidable(), createCategoryController);

// Update Category
router.put('/update-category/:id', requireSignIn, isAdmin, formidable(), updateCategoryController);

// Delete Category
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController);

// Get Category
router.get('/get-category/:slug', getCategoryController);

// Get Categories
router.get('/get-categories', getCategoriesController);

// Search Categories
router.get('/search-categories/:keyword', searchCategoriesController);

// get-photo
router.get("/get-category-photo/:id", getCategoryPhotoController);

export default router;