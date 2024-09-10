import validator from "validator";
import slugify from "slugify";
import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import doctorModel from "../models/doctorModel.js";
import fs from "fs";
import categoryModel from "../models/categoryModel.js";

// Register
const registerController = async (req, res) => {

    try{
        const { name, username, emailId, password, confirmPassword, phoneNumber, address, description, fees, category } = req.fields;
        const { photo, certificate } = req.files;

        // Fields are Empty
        if( !name || !username || !emailId || !password || !confirmPassword || !phoneNumber || !address || !description || !fees){
            return res.status(200).send({
                success: false,
                message: 'One or More Details are not Filled',
            });
        }

        // Photo size Check
        if(!photo || (photo.size > 1000000)){
            return res.status(200).send({
                 success: false,
                 message: 'Photo should be size of less then 10MB',
            });
        }

        if(!certificate || (certificate.size > 1000000)){
            return res.status(200).send({
                 success: false,
                 message: 'Certificate should be size of less then 10MB',
            });
       }

        // Check Email Already Exist
        const existingEmail = await doctorModel.findOne({emailId});
        if(existingEmail){
            return res.status(200).send({
                success: false,
                message: 'Already, Email Address is Registered',
            });
        }

        // Check Username Already Exist
        const existingUsername = await doctorModel.findOne({username});
        if(existingUsername){
            return res.status(200).send({
                success: false,
                message: 'Already, Usename is Registered',
            });
        }

        // Validations
        if(!validator.isAscii(name)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Name',
            });
        }
        else if(!validator.isAscii(username) || !validator.isLowercase(username)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Username in LowerCase',
            });
        }
        else if(!validator.isEmail(emailId) || !validator.isLowercase(emailId)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Email in Lowercase',
            });
        }
        else if(!validator.isStrongPassword(password)){
            return res.status(200).send({
                success: false,
                message: 'Make a Strong Password',
            });
        }
        // Password and Confirm Password Match
        else if(password !== confirmPassword){
            return res.status(200).send({
                success: false,
                message: 'Password Not Mached',
            });
        }
        else if(!validator.isNumeric(phoneNumber) || !validator.isLength(phoneNumber, {min: 10, max: 10})){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Indian Phone Number',
            });
        }
        else if(!validator.isAscii(address)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Address',
            });
        }
        else if(!validator.isAscii(description)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Name',
            });
        }
        else if(!validator.isNumeric(fees)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Name',
            });
        }

        // Hash Generate
        const hashedPassword = await hashPassword(password);

        // Save
        const user = await new doctorModel({ name, username, slug: slugify(username), emailId, password : hashedPassword, phoneNumber, address, category, description, fees });
        if(photo){
            user.photo.data = fs.readFileSync(photo.path);
            user.photo.contentType = photo.type;
        }
        if(certificate){
            user.certificate.data = fs.readFileSync(certificate.path);
            user.certificate.contentType = certificate.type;
        }

        // Token
        const token = await JWT.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        user.tokens = user.tokens.concat({token: token});
        await user.save();

        // Cookie Store
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 604800),
            httpOnly:true //client can not change or remove 
            //secure: true //https only work
        });

        // Successfully Registered
        res.status(201).send({
            success: true,
            message: `Please Check Letter For Login if Admin Confirm`,
            user: user,
            token
        }); 
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error In Registration',
            error: error,
        });
    }

};

const loginController = async (req, res) => {
   
    try{
        const { credentials, password } = req.body;

        // Fields are Empty
        if(!credentials || !password){
            return res.status(200).send({
                success: false,
                message: 'Invalid Credentials',
            });
        }

        const user = await doctorModel.findOne({ $or: [ { username: credentials }, { emailId: credentials } ] });
        if(!user){
            return res.status(200).send({
                success: false,
                message: 'Invalid Credentials',
            });
        }

        // Match Password
        const matchPassword = await comparePassword(password, user.password);
        if(!matchPassword){
            return res.status(200).send({
                success: false,
                message: 'Invalid Credentials',
            });
        }

        if(!user.approval){
            return res.status(200).send({
                success: false,
                message: 'Please Try Letter, This time you are not approved',
            });
        }

        // Token
        const token = await JWT.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        user.tokens = user.tokens.concat({token: token});
        await user.save();

        // Cookie Store
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 604800),
            httpOnly:true //client can not change or remove 
            //secure: true //https only work
        });

        // Successfully Login
        res.status(201).send({
            success: true,
            message: `${user.name}, Login Successful`,
            user: user,
            token
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error In Login',
            error: error,
        });
    }

};

// Logout
const logoutController = async (req, res) => {

    try{
        const user = await doctorModel.findById(req.user._id);
        // Delete token from database
        user.tokens = user.tokens.filter((currElem) => {
            return (currElem.token != req.token);
        });

        // Delete token from cookie
        res.clearCookie("jwt");

        // // second method of logout => logout from all devices
        // // delete tokens from database 
        // req.user.tokens = [];
        // // delete token from cookie 
        // res.clearCookie("jwt");

        await user.save();
        res.status(200).send({
            success: true,
            message: 'Successfully Logout',
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error In Logout',
            error: error,
        });
    }

};


const updateProfileController = async (req, res) => {

    try{
        const { name, oldPassword, newPassword, phoneNumber, address, category, description, fees } = req.fields;
        const { photo, certificate } = req.files;
        const user = await doctorModel.findById(req.user._id);

        // Fields are Empty
        if( !name || !oldPassword || !newPassword || !phoneNumber || !address || !category || !description || !fees ){
            return res.status(200).send({
                success: false,
                message: 'One or More Details are not Filled',
            });
        }

        // Match Password
        const matchPassword = await comparePassword(oldPassword, user.password);
        if(!matchPassword){
            return res.status(200).send({
                success: false,
                message: 'Invalid Password',
            });
        }

        // Photo size Check
        if(photo && (photo.size > 1000000)){
            return res.status(200).send({
                 success: false,
                 message: 'Photo should be size of less then 10MB',
            });
        }

        if(certificate && (certificate.size > 1000000)){
            return res.status(200).send({
                 success: false,
                 message: 'Certificate should be size of less then 10MB',
            });
       }

        // Validations
        if(!validator.isAscii(name)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Name',
            });
        }
        else if(!validator.isStrongPassword(newPassword) &&  newPassword){
            return res.status(200).send({
                success: false,
                message: 'Make a Strong Password',
            });
        }
        else if(!validator.isNumeric(phoneNumber) || !validator.isLength(phoneNumber, {min: 10, max: 10})){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Indian Phone Number',
            });
        }
        else if(!validator.isAscii(address)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Address',
            });
        }
        else if(!validator.isAscii(description)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Name',
            });
        }
        else if(!validator.isNumeric(fees)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Name',
            });
        }

        // Hash Generate
        const hashedNewPassword = newPassword ? await hashPassword(newPassword) : undefined;

        // Save
        const updateUser = await doctorModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name, password: hashedNewPassword || user.password,
            phoneNumber: phoneNumber || user.phoneNumber,
            address: address || user.address, category: category || user.category, description: description || user.description, fees: fees || user.fees
        }, {new: true});
        if(photo){
            updateUser.photo.data = fs.readFileSync(photo.path);
            updateUser.photo.contentType = photo.type;
        }
        if(certificate){
            updateUser.certificate.data = fs.readFileSync(certificate.path);
            updateUser.certificate.contentType = certificate.type;
        }
        await updateUser.save();

        // Successfully Registered
        res.status(201).send({
            success: true,
            message: `${updateUser.name}, Update Successful`,
            user: updateUser,
        }); 
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error In Updation',
            error: error,
        });
    }

};

const updateApprovalStatusController = async (req, res) => {

    try{
        const { approval } = req.body;
        const { id } = req.params;

        // Fields are Empty
        if(!approval){
            return res.status(200).send({
                success: false,
                message: 'Enter Boolean Value',
            });
        }

        if(!validator.isBoolean(approval)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Name',
            });
        }

        const updateUser = await doctorModel.findByIdAndUpdate(id, { approval }, {new: true});

        // Successfully Update
        res.status(201).send({
            success: true,
            message: `${updateUser.name}, Status Update Successful`,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error In Updation',
            error: error,
        });
    }

};

const getDoctorPhotoController = async (req, res) => {

    try{
         const { id } = req.params;

         const doctorPhoto = await doctorModel.findById(id).select('photo');
         if(doctorPhoto.photo.data){
              res.set('Content-type', doctorPhoto.photo.contentType);
              return res.status(201).send(doctorPhoto.photo.data);
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

const getCertificatePhotoController = async (req, res) => {

    try{
         const { id } = req.params;

         const certificatePhoto = await doctorModel.findById(id).select('certificate');
         if(certificatePhoto.certificate.data){
              res.set('Content-type', certificatePhoto.certificate.contentType);
              return res.status(201).send(certificatePhoto.certificate.data);
         }
    }
    catch(error){
         console.log(error);
         res.status(500).send({
              success: false,
              message: 'Error in Getting Cerificate Photo',
              error: error,
         });
    }

};

const getDoctorsListController = async (req, res) => {

    try{
        const doctors = await doctorModel.find({}).populate('category').select("-photo");

        // Successfully Got Products
        res.status(201).send({
            success: true,
            doctorsCount: doctors.length,
            message: 'Successfully got doctors',
            doctors: doctors,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
             success: false,
             message: 'Error in Getting Doctors',
             error: error,
        });
   }

};

const getDoctorsByCategoryController = async (req, res) => {

    try{
        const { slug } = req.params;

        const category = await categoryModel.findOne({ slug });
         console.log(category);
        const doctors = await doctorModel.find({ category }).populate('category').select("-photo");
         console.log(doctors);
        // Successfully Got Products
        res.status(201).send({
            success: true,
            doctorsCount: doctors.length,
            message: 'Successfully got doctors',
            doctors: doctors,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
             success: false,
             message: 'Error in Getting Doctors',
             error: error,
        });
   }

};

const getDoctorBySlugController = async (req, res) => {

    try{
        const { slug } = req.params;
        const doctor = await doctorModel.findOne({slug}).populate('category').select("-photo");

        // Successfully Got Products
        res.status(201).send({
            success: true,
            message: 'Successfully got doctor',
            doctor: doctor,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
             success: false,
             message: 'Error in Getting Doctor',
             error: error,
        });
   }

};

const getDoctorsCountController = async (req, res) => {

    try{
         const doctorsCount = await doctorModel.find({}).estimatedDocumentCount();

         // Successfully Count Products
         res.status(201).send({
              success: true,
              message: 'Successfully counted products',
              doctorsCount: doctorsCount,
         });
    }
    catch(error){
         console.log(error);
         res.status(500).send({
              success: false,
              message: 'Error in Counting The Doctors',
              error: error,
         });
    }

};

const searchDoctorsController = async (req, res) => {

    try{
         const { keyword } = req.params;

         const searchDoctors = await doctorModel.find({
              $or: [
                   {name: {$regex: keyword, $options: "i"}},
                   {description: {$regex: keyword, $options: "i"}},
              ],
         }).select("-photo");
         res.json(searchDoctors);
    }
    catch(error){
         console.log(error);
         res.status(500).send({
              success: false,
              message: 'Error in Searching Doctors',
              error: error,
         });
    }

};

export { registerController, loginController, logoutController, updateProfileController, updateApprovalStatusController, getDoctorPhotoController, getCertificatePhotoController, getDoctorsListController, getDoctorsByCategoryController, getDoctorBySlugController, getDoctorsCountController, searchDoctorsController };