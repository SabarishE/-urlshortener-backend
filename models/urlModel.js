import mongoose from "mongoose";
import shortid from "shortid";

// scehma for urls in urls collection 
const urlschema= new mongoose.Schema({

          long:{type:String,required:true},
            short:{type:String,default:shortid.generate},
            visitors:{type:Number,default:0}
})

export const URL = mongoose.model("url",urlschema);