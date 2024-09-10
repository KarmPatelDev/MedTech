import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },
        username:{
            type:String,
            required:true,
            trim:true,
            unique: true,
        },
        slug:{
            type: String,
            lowercase: true,
            required: true,
            trim: true,
        },
        emailId:{
            type:String,
            required:true,
            trim:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        phoneNumber:{
            type:Number,
            required:true,
        },
        address:{
            type:String,
            required:true,
        },
        role: {
            type: Number,
            default: 0,
        },
        tokens: [{
            token: {
                type: String,
                required: true,
                trim: true,
            }
        }]
    },
    {timestamps:true}
);

export default mongoose.model("admins", adminSchema);

