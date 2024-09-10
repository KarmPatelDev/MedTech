import mongoose from "mongoose";

const bookedAppointmentSchema =  new mongoose.Schema(
    {
        patient:{
            type:mongoose.ObjectId,
            ref:"patients",
            required:true
        },
        doctor:{
            type:mongoose.ObjectId,
            ref:"doctors",
            required:true
        },
        totalCost:{
            type:Number,
            required:true
        },
        appointmentTime:{
            type:String,
            required:true,
        },
        height:{
            type:String,
            required:true,
        },
        weight:{
            type:String,
            required:true,
        },
        lowBloodPressure:{
            type:String,
        },
        highBloodPressure:{
            type:String,
        },
        pulse:{
            type:String,
        },
        symptoms:{
            type: String,
            required:true,
        },
        advice:{
            type: String,
            default: "",
        },
        photo:{
            data:Buffer,
            contentType:String,
        },
        completed:{
            type: Boolean,
            required: true,
            default: false,
        }
    },
    {timestamps:true}
);

export default mongoose.model("bookedappointments", bookedAppointmentSchema);