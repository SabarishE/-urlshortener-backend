import mongoose from "mongoose";


// creating schmema for users collection in userlist DB 

const userschema= new mongoose.Schema({

    firstname:{type:String,required:true},
    lastname:{type:String,required:true},
    email:{type:String,required:true},
    passwordHash:{type:String},
    isActivated:{type:Boolean,default:false},
    randomString:{type:String}
    })

export const User = mongoose.model("userurl",userschema);