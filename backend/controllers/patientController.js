import validator from "validator";
import patientModel from "../models/patientModel.js";
import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import slugify from "slugify";

// Register
const registerController = async (req, res) => {

    try{
        const { name, username, emailId, password, confirmPassword, phoneNumber, address, gender, birthdate } = req.body;

        // Fields are Empty
        if(!name || !username || !emailId || !password || !confirmPassword || !phoneNumber || !address || !gender || !birthdate){
            return res.status(200).send({
                success: false,
                message: 'One or More Details are not Filled',
            });
        }

        // Check Email Already Exist
        const existingEmail = await patientModel.findOne({emailId});
        if(existingEmail){
            return res.status(200).send({
                success: false,
                message: 'Already, Email Address is Registered',
            });
        }

        // Check Username Already Exist
        const existingUsername = await patientModel.findOne({username});
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
        else if(!validator.isAscii(gender)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Gender',
            });
        }
        else if(!validator.isAscii(birthdate)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Birthdate',
            });
        }

        // Hash Generate
        const hashedPassword = await hashPassword(password);

        // Save
        const user = await new patientModel({ name, username, slug: slugify(username), emailId, password : hashedPassword, phoneNumber, address, gender, birthdate });

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
            message: `Congratulations ${name}, You Successfully Registered`,
            user: {
                name: user.name,
                username: user.username,
                slug: user.slug,
                emailId: user.emailId,
                phoneNumber: user.phoneNumber,
                address: user.address,
                gender: gender,
                birthdate: birthdate,
                role: user.role,
            },
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

        const user = await patientModel.findOne({ $or: [ { username: credentials }, { emailId: credentials } ] });
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
            user: {
                name: user.name,
                username: user.username,
                slug: user.slug,
                emailId: user.emailId,
                phoneNumber: user.phoneNumber,
                address: user.address,
                gender: user.gender,
                birthdate: user.birthdate,
                role: user.role,
            },
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
        const user = await patientModel.findById(req.user._id);
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
        const {name, oldPassword, newPassword, phoneNumber, address, gender, birthdate} = req.body;
        const user = await patientModel.findById(req.user._id);

        // Fields are Empty
        if(!name || !oldPassword || !phoneNumber || !address || !gender || !birthdate){
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
        else if(!validator.isAscii(gender)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Gender',
            });
        }
        else if(!validator.isAscii(birthdate)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Birthdate',
            });
        }

        // Hash Generate
        const hashedNewPassword = newPassword ? await hashPassword(newPassword) : undefined;

        const updateUser = await patientModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name, password: hashedNewPassword || user.password,
            phoneNumber: phoneNumber || user.phoneNumber,
            address: address || user.address, gender: gender || user.gender, birthdate: birthdate || user.birthdate
        }, {new: true});

        // Successfully Update
        res.status(201).send({
            success: true,
            message: `${updateUser.name}, Update Successful`,
            user: {
                name: updateUser.name,
                username: updateUser.username,
                slug: updateUser.slug,
                emailId: updateUser.emailId,
                phoneNumber: updateUser.phoneNumber,
                address: updateUser.address,
                gender: updateUser.gender,
                birthdate: updateUser.birthdate,
                role: updateUser.role,
            }
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error While Updation',
            error: error,
        });
    }
};

const getPatientController = async (req, res) => {

    try{
        const { slug } = req.params;
        const patient = await patientModel.findOne({slug});

        // Successfully Got Products
        res.status(201).send({
            success: true,
            message: 'Successfully got patient',
            patient: patient,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
             success: false,
             message: 'Error in Getting Patient',
             error: error,
        });
   }

};

const getPatientBySlugController = async (req, res) => {

    try{
        const { slug } = req.params;
        const patient = await patientModel.findOne({slug});

        // Successfully Got Products
        res.status(201).send({
            success: true,
            message: 'Successfully got patient',
            patient: patient,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
             success: false,
             message: 'Error in Getting Patient',
             error: error,
        });
   }

};

export { registerController, loginController, logoutController, updateProfileController, getPatientBySlugController, getPatientController };