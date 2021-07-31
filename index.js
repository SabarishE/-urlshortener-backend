import express from "express";

import mongoose from "mongoose";

import cors from "cors";

import router from "./routes/users.js";

const PORT = process.env.PORT || 5000;

const app=express();

app.use(express.json());
app.use(cors());


app.listen(PORT,console.log("server started"));

app.get("/",(req,res)=>{
  res.send({reponse:"welcome to URL shortener app (task - 4 of backend)  !!!"})
})

console.log("welcome to password reset flow (task - 3 of backend) !!!");


const url= "mongodb+srv://SabarishE:sabarishe@cluster0.eeimf.mongodb.net/url-shortener"

mongoose.connect(url,{useNewUrlParser:true});

const con=mongoose.connection;
 
con.on("open",()=>console.log("MongoDB in connected"));

app.use("/users",router);


