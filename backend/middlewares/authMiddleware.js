import JWT from "jsonwebtoken";
import adminModel from "../models/adminModel.js"
import doctorModel from "../models/doctorModel.js";
import patientModel from "../models/patientModel.js";

// Protected Routes Token Based
const requireSignIn = async (req, res, next) => {
    try{
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        if(!decode){
            req.ok = false;
        }
        else{
            req.user = decode;
            req.token = req.headers.authorization;
            req.ok = true;
        }
        next();
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something Went Wrong',
            error: error,
        });
    }
};

// Admin Access
const isAdmin = async (req, res, next) => {

    try{
        const user = await adminModel.findById(req.user._id);
        (user.role === 0) ? req.ok = true : req.ok = false ;
        next(); 
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something Went Wrong',
            error: error,
        });
    }

};

// Doctor Access
const isDoctor = async (req, res, next) => {

    try{
        const user = await doctorModel.findById(req.user._id);
        (user.role === 1) ? req.ok = true : req.ok = false ;
        next(); 
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something Went Wrong',
            error: error,
        });
    }

};

// Patient Access
const isPatient = async (req, res, next) => {

    try{
        const user = await patientModel.findById(req.user._id);
        (user.role === 2) ? req.ok = true : req.ok = false ;
        next(); 
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something Went Wrong',
            error: error,
        });
    }

};

export { requireSignIn, isAdmin, isDoctor, isPatient };