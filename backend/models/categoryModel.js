import mongoose from "mongoose";

 const categorySchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            unique: true,
            trim: true,
        },
        slug:{
            type: String,
            lowercase: true,
            required: true,
            trim: true,
        },
        photo:{
            data:Buffer,
            contentType:String,
        },
    },
    {timestamps:true}
 );

 export default mongoose.model("categories", categorySchema);