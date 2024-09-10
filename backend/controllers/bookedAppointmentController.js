import bookedAppointmentModel from "../models/bookedAppointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import braintree from "braintree";
import dotenv from "dotenv";
import { encrypt, decrypt, convertArray } from "../helpers/conversionHelper.js";
import validator from "validator";
import fs from "fs";
import patientModel from "../models/patientModel.js";

dotenv.config();

// Payment Gaateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const braintreeTokenController = async (req, res) => {

    try{
         gateway.clientToken.generate({}, function (error, response){
              if(error){
                   console.log(error);
                   res.status(500).send({
                        success: false,
                        message: "Error in Generate Token",
                        error: error,
                   });
              }
              else{
                   // Successfully Generate Token
                   res.status(201).send({
                        success: true,
                        message: "Generate Token Successful",
                        response: response,
                   });
              }
         });
    }
    catch(error){
         console.log(error);
         res.status(500).send({
              success: false,
              message: "Error in Generate Token",
              error: error,
         });
    }

};

const braintreePaymentController = async (req, res) => {

    try{
        let {totalCost, nonce} = req.body;

        // Fields are Empty
        if(!totalCost){
            return res.status(200).send({
                success: false,
                message: 'Some Details are not Filled',
            });
        }
        
        totalCost = totalCost.toString();
        
        let newTransaction = gateway.transaction.sale(
              {
              amount: totalCost,
              paymentMethodNonce: nonce,
              options: {
                   submitForSettlement: true,
              },
              },
              async (error, response) => {
                    if(response){
                        res.status(201).send({
                            success: true,
                            message: "success Payment",
                            error: error,
                        });
                        console.log("hello3");
                    }
                    else{
                        // Payment Error
                        res.status(500).send({
                            success: false,
                            message: "Error in Payment",
                            error: error,
                        });
                    }
                }
            );
        }
        catch(error){
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in Payment',
                error: error,
            });
        }
};


const bookAppointmentController = async (req, res) => {

    try{

        let { patientSlug, doctorSlug, appointmentTime, height, weight, lowBloodPressure, highBloodPressure, pulse, symptoms } = req.fields;
        const { photo } = req.files;

        // Fields are Empty
        if( !patientSlug || !doctorSlug || !appointmentTime || !height || !weight || !symptoms){
            return res.status(200).send({
                success: false,
                message: 'Some Details are not Filled',
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
        if(!validator.isAscii(appointmentTime) || (new Date(appointmentTime) < new Date())){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Time',
            });
        }
        else if(!validator.isAscii(symptoms)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Symptoms',
            });
        }
        else if(!validator.isAscii(height)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Height',
            });
        }
        else if(!validator.isAscii(weight)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Weight',
            });
        }
        else if(!validator.isAscii(lowBloodPressure)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Low Blood Pressure',
            });
        }
        else if(!validator.isAscii(highBloodPressure)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid High Blood Pressure',
            });
        }
        else if(!validator.isAscii(pulse)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Pulse',
            });
        }

        const doctor = await doctorModel.findOne({slug: doctorSlug});
        const patient = await patientModel.findOne({slug: patientSlug});

        
        appointmentTime = new Date(appointmentTime);
        appointmentTime.setMinutes(0);

        const book = await bookedAppointmentModel.findOne({appointmentTime, doctor});

        if(book){
            return res.status(200).send({
                success: false,
                message: 'This time is not available',
            });
        }
        
        const booked = await new bookedAppointmentModel({ patient, doctor, totalCost: 300, appointmentTime, height: encrypt(height), weight: encrypt(weight), lowBloodPressure: encrypt(lowBloodPressure), highBloodPressure: encrypt(highBloodPressure), pulse: encrypt(pulse), symptoms: encrypt(symptoms), advice: encrypt("") });
        if(photo){
            booked.photo.data = fs.readFileSync(photo.path);
            booked.photo.contentType = photo.type;
        }
        await booked.save();

        console.log(booked);

        // Payment Successful
        res.status(201).send({
            success: true,
            message: "Payment Successful",
            booked: {
                patient: booked.patient,
                doctor: booked.doctor,
                appointmentTime: appointmentTime,
                height: decrypt(booked.height),
                weight: decrypt(booked.weight),
                lowBloodPressure: decrypt(booked.lowBloodPressure),
                highBloodPressure: decrypt(booked.highBloodPressure),
                pulse: decrypt(booked.pulse),
                symptoms: decrypt(booked.symptoms),
                completed: booked.completed,
                photo: booked.photo
            },
        });
        }
        catch(error){
            console.log(error);
            res.status(501).send({
                success: false,
                message: 'Error in Payment',
                error: error,
            });
        }
};

const getPatientsController = async (req, res) => {

    try{
        const patientsRetrieve = await bookedAppointmentModel.find({}).populate("patient").populate("doctor").select("-photo");

         const patients = convertArray(patientsRetrieve);
        res.status(201).send({
            success: true,
            message: `Successfully got patients`,
            patients: patients,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Getting Patients',
            error: error,
        });
    }
    
};

const getHistoryController = async (req, res) => {

    try{
        const historyRetrieve = await bookedAppointmentModel.find({patient: req.user}).populate("patient").populate("doctor").select("-photo");

        const history = convertArray(historyRetrieve);
        res.status(201).send({
            success: true,
            message: `Successfully got history`,
            history: history,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Getting History',
            error: error,
        });
    }

};

const getPatientHistoryController = async (req, res) => {
    try{
        const { id } = req.params;
        const booked = await bookedAppointmentModel.findById(id).populate("patient").populate("doctor").select("-photo"); 
        res.status(201).send({
            success: true,
            message: `Successfully got patient`,
            booked: {
                id: booked._id,
                patient: booked.patient,
                appointmentTime: booked.appointmentTime,
                height: decrypt(booked.height),
                weight: decrypt(booked.weight),
                lowBloodPressure: decrypt(booked.lowBloodPressure),
                highBloodPressure: decrypt(booked.highBloodPressure),
                pulse: decrypt(booked.pulse),
                symptoms: decrypt(booked.symptoms),
                advice: decrypt(booked.advice),
                completed: booked.completed,
            },
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

const getDoctorPatientController = async (req, res) => {

    try{
        const { id } = req.params;
        const booked = await bookedAppointmentModel.findById(id).populate("patient").populate("doctor").select("-photo"); 
        res.status(201).send({
            success: true,
            message: `Successfully got patient`,
            booked: {
                id: booked._id,
                patient: booked.patient,
                appointmentTime: booked.appointmentTime,
                height: decrypt(booked.height),
                weight: decrypt(booked.weight),
                lowBloodPressure: decrypt(booked.lowBloodPressure),
                highBloodPressure: decrypt(booked.highBloodPressure),
                pulse: decrypt(booked.pulse),
                symptoms: decrypt(booked.symptoms),
                advice: decrypt(booked.advice),
                completed: booked.completed,
            },
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

const getDoctorPatientsController = async (req, res) => {

    try{
        const uncompletePatients = await bookedAppointmentModel.find({doctor: req.user, completed: false}).populate("patient").populate("doctor").select("-photo");
        const completedPatients = await bookedAppointmentModel.find({doctor: req.user, completed: true}).populate("patient").populate("doctor").select("-photo");

        const patientsRetrieve = [...uncompletePatients, ...completedPatients];

        const patients = convertArray(patientsRetrieve);
        res.status(201).send({
            success: true,
            message: `Successfully got patients`,
            patients: patients,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Getting Patients',
            error: error,
        });
    }

};

const getTransactionsController = async (req, res) => {

    try{

        const doctors = await doctorModel.find({}).populate('category').select("-photo");
        
        const data = [];

        async function getHistoryData(doctor){
            const uncompletePatients = await bookedAppointmentModel.find({doctor: doctor, completed: false}).populate("patient").populate("doctor").select("-photo");
            const completedPatients = await bookedAppointmentModel.find({doctor: doctor, completed: true}).populate("patient").populate("doctor").select("-photo");
            const patientsRetrieve = [...uncompletePatients, ...completedPatients];
            const patients = convertArray(patientsRetrieve);
            data.push({name: doctor.name, history: patients});
        }
        await Promise.all(doctors.map(getHistoryData));

        res.status(201).send({
            success: true,
            message: `Successfully got history`,
            history: data,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Getting History',
            error: error,
        });
    }

};

const getUpdatePatientStatusController = async (req, res) => {

    try{
        const { id, advice } = req.body;

        // Fields are Empty
        if( !advice ){
            return res.status(200).send({
                success: false,
                message: 'Some Details are not Filled',
            });
        }

        if(!validator.isAscii(advice)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Advice',
            });
        }

        // Update
        const updatePatient = await bookedAppointmentModel.findByIdAndUpdate(id, {advice: encrypt(advice), completed: true}, {new: true});

        // Successfully Updated Category
        res.status(201).send({
            success: true,
            message: `Successfully status updated`,
            updatePatient: {
                patient: updatePatient.patient,
                doctor: updatePatient.doctor,
                appointmentTime: updatePatient.appointmentTime,
                height: decrypt(updatePatient.height),
                weight: decrypt(updatePatient.weight),
                lowBloodPressure: decrypt(updatePatient.lowBloodPressure),
                highBloodPressure: decrypt(updatePatient.highBloodPressure),
                pulse: decrypt(updatePatient.pulse),
                symptoms: decrypt(updatePatient.symptoms),
                advice: decrypt(updatePatient.advice),
                completed: updatePatient.completed,
                photo: updatePatient.photo
            },
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Updation',
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

const getPatientDocController = async (req, res) => {

    try{
         const { id } = req.params;

         const patientDoc = await bookedAppointmentModel.findById(id).select('photo');
         if(patientDoc.photo.data){
              res.set('Content-type', patientDoc.photo.contentType);
              return res.status(201).send(patientDoc.photo.data);
         }
    }
    catch(error){
         console.log(error);
         res.status(500).send({
              success: false,
              message: 'Error in Getting Patient Document',
              error: error,
         });
    }

};

const updateHistoryStatusController = async (req, res) => {

    try{
        const { id, symptoms } = req.fields;
        const { photo } = req.files;

        const historyTime = await bookedAppointmentModel.findById(id).select("appointmentTime");

        const time = new Date(historyTime);
        const date = time.getDate();
        time.setDate(date + 7);

        if((new Date(time) > new Date())){
            return res.status(200).send({
                success: false,
                message: 'Please, Book New Appointment, 7 days Completed',
            });
        }

        // Fields are Empty
        if(!symptoms){
            return res.status(200).send({
                success: false,
                message: 'Some Details are not Filled',
            });
        }

        // Photo size Check
        if(!photo || (photo.size > 1000000)){
            return res.status(200).send({
                 success: false,
                 message: 'Photo should be size of less then 10MB',
            });
        }

        if(!validator.isAscii(symptoms)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Advice',
            });
        }

        // Update
        const updatePatient = await bookedAppointmentModel.findByIdAndUpdate(id, {symptoms: encrypt(symptoms), completed: false}, {new: true});
        if(photo){
            updatePatient.photo.data = fs.readFileSync(photo.path);
            updatePatient.photo.contentType = photo.type;
        }
        await updatePatient.save();

        // Successfully Updated Category
        res.status(201).send({
            success: true,
            message: `Successfully status updated`,
            updatePatient: {
                patient: updatePatient.patient,
                doctor: updatePatient.doctor,
                appointmentTime: updatePatient.appointmentTime,
                height: decrypt(updatePatient.height),
                weight: decrypt(updatePatient.weight),
                lowBloodPressure: decrypt(updatePatient.lowBloodPressure),
                highBloodPressure: decrypt(updatePatient.highBloodPressure),
                pulse: decrypt(updatePatient.pulse),
                symptoms: decrypt(updatePatient.symptoms),
                advice: decrypt(updatePatient.advice),
                completed: updatePatient.completed,
                photo: updatePatient.photo
            },
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Updation',
            error: error,
        });
    }

};

export { getPatientsController, getHistoryController, getPatientHistoryController, updateHistoryStatusController, getDoctorPatientsController, getUpdatePatientStatusController, getDoctorPhotoController, getCertificatePhotoController, getPatientDocController,  braintreeTokenController, braintreePaymentController, bookAppointmentController, getDoctorPatientController, getTransactionsController};