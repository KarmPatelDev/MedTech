import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import dbConnect from "./config/dbConnect.js";
import cors from "cors";
import adminRoute from "./routes/adminRoute.js";
import doctorRoute from "./routes/doctorRoute.js";
import patientRoute from "./routes/patientRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import AIRoute from "./routes/AIRoute.js";
import bookedAppointmentRoute from "./routes/bookedAppointmentRoute.js";

// Configure ENV
dotenv.config();

// Rest Object
const app = express();

// Database Config
dbConnect();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routers
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/doctor', doctorRoute);
app.use('/api/v1/patient', patientRoute);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/bookappointment', bookedAppointmentRoute);
app.use('/api/v1/ai', AIRoute);

// Rest API
app.get("/", (req, res) => {
    res.send("Welcome To New Dunia");
});

// PORT
const PORT = process.env.PORT || 8080;

// Run Listen
app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.DEV_MODE} at PORT ${PORT}`);
});