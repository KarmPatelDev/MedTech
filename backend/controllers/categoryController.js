import validator from "validator";
import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";

const createCategoryController = async (req, res) => {

    try{
        const { name } = req.fields;
        const { photo } = req.files;

        // Fields are Empty
        if(!name){
            return res.status(200).send({
                success: false,
                message: 'Category is not Filled',
            });
        }

        // Photo size Check
        if(!photo || (photo.size > 1000000)){
            return res.status(200).send({
                 success: false,
                 message: 'Photo should be size of less then 10MB',
            });
        }

        // Check Category Already Exist
        const existingCategory = await categoryModel.findOne({name});
        if(existingCategory){
            return res.status(200).send({
                success: false,
                message: 'Already, Category is Exist',
            });
        }

        // Validations
        if(!validator.isAscii(name) && !validator.isLowercase(name)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Category in Lowercase',
            });
        }

        // Save
        const category = await new categoryModel({ name, slug: slugify(name) });
        if(photo){
            category.photo.data = fs.readFileSync(photo.path);
            category.photo.contentType = photo.type;
        }
        await category.save();

        // Successfully Created Category
        res.status(201).send({
            success: true,
            message: `Successfully ${name} category created`,
            category: category,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Create Category',
            error: error,
        });
    }

};

const updateCategoryController = async (req, res) => {

    try{
        const { name } = req.fields;
        const { id } = req.params;
        const { photo } = req.files;

        // Fields are Empty
        if(!name){
            return res.status(200).send({
                success: false,
                message: 'Category is not Filled',
            });
        }

        // Photo size Check
        if(!photo || (photo.size > 1000000)){
            return res.status(200).send({
                 success: false,
                 message: 'Photo should be size of less then 10MB',
            });
        }

        // Validations
        if(!validator.isAscii(name) && !validator.isLowercase(name)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Category in Lowercase',
            });
        }

        // Update
        const category = await categoryModel.findByIdAndUpdate(id, {name, slug: slugify(name)}, {new: true});
        if(photo){
            category.photo.data = fs.readFileSync(photo.path);
            category.photo.contentType = photo.type;
        }
        await category.save();
        
        // Successfully Updated Category
        res.status(201).send({
            success: true,
            message: `Successfully category updated to ${name}`,
            category: category,
        });

    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Update Category',
            error: error,
        });
    }

};

const deleteCategoryController = async (req, res) => {

    try{
        const { id } = req.params;

        // Delete
        const category = await categoryModel.findByIdAndDelete(id);
        
        // Successfully Deleted Category
        res.status(201).send({
            success: true,
            message: `Successfully category deleted`,
            category: category,
        });

    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Delete Category',
            error: error,
        });
    }

};

const getCategoryController = async (req, res) => {

    try{
        const { slug } = req.params;

        const category = await categoryModel.findOne({slug});

        // Successfully Got Category
        res.status(201).send({
            success: true,
            message: `Successfully got category`,
            category: category,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Getting Category',
            error: error,
        });
    }

};

const getCategoriesController = async (req, res) => {

    try{
        const categories = await categoryModel.find({});

        // Successfully Got Categories
        res.status(201).send({
            success: true,
            message: `Successfully got categories`,
            categories: categories,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Getting Categories',
            error: error,
        });
    }
    
};

const searchCategoriesController = async (req, res) => {

    try{
         const { keyword } = req.params;

         const searchCategories = await categoryModel.find({
              $or: [
                   {name: {$regex: keyword, $options: "i"}},
                   {slug: {$regex: keyword, $options: "i"}},
              ],
         });
         res.json(searchCategories);
    }
    catch(error){
         console.log(error);
         res.status(500).send({
              success: false,
              message: 'Error in Searching Categories',
              error: error,
         });
    }

};

const getCategoryPhotoController = async (req, res) => {

    try{
         const { id } = req.params;

         const categoryPhoto = await categoryModel.findById(id).select('photo');
         if(categoryPhoto.photo.data){
              res.set('Content-type', categoryPhoto.photo.contentType);
              return res.status(201).send(categoryPhoto.photo.data);
         }
    }
    catch(error){
         console.log(error);
         res.status(500).send({
              success: false,
              message: 'Error in Getting Photo',
              error: error,
         });
    }

};

export { createCategoryController, updateCategoryController, deleteCategoryController, getCategoryController, getCategoriesController, searchCategoriesController,  getCategoryPhotoController};