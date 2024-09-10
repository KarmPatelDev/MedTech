import express from "express";
import { requireSignIn, isPatient, isDoctor, isAdmin } from "../middlewares/authMiddleware.js";
import { getPatientsController, getHistoryController, getPatientHistoryController, updateHistoryStatusController, getDoctorPatientsController, getUpdatePatientStatusController, getDoctorPhotoController, getCertificatePhotoController, getPatientDocController,  braintreeTokenController, braintreePaymentController, bookAppointmentController, getDoctorPatientController, getTransactionsController} from "../controllers/bookedAppointmentController.js";
import formidable from "express-formidable";

// Router Object
const router = express.Router();

router.get('/get-patients', requireSignIn, isAdmin, getPatientsController);

router.get('/get-history', requireSignIn, isPatient, getHistoryController);

router.get('/get-patient-history/:id', requireSignIn, isPatient, getPatientHistoryController);

router.put('/update-history-status', requireSignIn, isPatient, formidable(), updateHistoryStatusController); 

router.get('/get-doctor-patient/:id', requireSignIn, isDoctor, getDoctorPatientController);

router.get('/get-doctor-patients', requireSignIn, isDoctor, getDoctorPatientsController);

router.get('/get-transactions', requireSignIn, isAdmin, getTransactionsController);

router.put('/update-patient-status', requireSignIn, isDoctor, getUpdatePatientStatusController);

router.get('/get-doctor-photo/:id', getDoctorPhotoController);

router.get('/get-certificate-photo/:id', getCertificatePhotoController);

router.get('/get-patient-doc/:id', getPatientDocController);

// Payment Route

// Token Generate
router.get('/braintree/token', requireSignIn, isPatient, braintreeTokenController);

// Payment
router.post('/braintree/payment', requireSignIn, isPatient, braintreePaymentController);
router.post('/book-appointment', requireSignIn, isPatient, formidable(), bookAppointmentController);

export default router;