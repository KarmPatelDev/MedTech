import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
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
            unique:true,
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
        category:{
            type:mongoose.ObjectId,
            ref:"categories"
        }
        ,
        description:{
            type:String,
            required:true,
            trim:true
        },
        fees:{
            type:Number,
            required:true
        },
        photo:{
            data:Buffer,
            contentType:String,
        },
        certificate:{
            data:Buffer,
            contentType:String,
        },
        approval:{
            type:Boolean,
            required:true,
            default: false,
        },
        role: {
            type: Number,
            default: 1,
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

export default mongoose.model("doctors", doctorSchema);