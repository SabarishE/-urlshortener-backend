import express from "express";

import {User} from "../models/userModel.js";
import {URL} from "../models/urlModel.js"

import jwt from "jsonwebtoken";

import { transporter } from "./nodemailer.js";


import bcrypt from "bcryptjs"
// import bcrypt from "bcrypt";

const router =express.Router();

// getting all users from mongoDB

router.get("/",async(req,res)=>{

    const users = await User.find();
    console.log(users,"number of users-->>>-- "+users.length);
    
    res.send(users);
    
})

// ------------ Sign up--------------

router.post("/signup",(async(req,res)=>{

  const adduser=req.body ;
  console.log("Sign up input details >>>>",adduser);

  const salt=await bcrypt.genSalt(10);

  const passwordHash =await bcrypt.hash(adduser.password,salt);

  const user=new User({
     firstname:adduser.firstname,
     lastname:adduser.lastname,
     email:adduser.email,
     passwordHash:passwordHash
    })
 

  try{
    //saving the user signing up (before activation)
    const newuser =await user.save();
    console.log("new signup >>>>",newuser)

//signing JWT token for one time link

const payload={firstname:adduser.firstname,lastname:adduser.lastname}

const key=passwordHash+adduser.email
const token =jwt.sign(payload,key);

//  sending activation link through email

const onetimelink =adduser.link + "/" +adduser.email+"/"+token ;
    res.send({newuser:newuser,link:onetimelink,message:"activation link sent to email !!!"});
    console.log("activation link sent to email !!!",newuser.email);

    var mailOptions = {
      from: 'one.trial.one.trial@gmail.com',
      to: 'one.trial.one.trial@gmail.com',
      subject: 'Account activation mail',
      text: onetimelink
    };

    transporter.sendMail(mailOptions, function(error, info){
if (error) {
  console.log(error);
} else {
  console.log('Email sent: ' + info.response);
}
});



  }
  catch(err){
     res.status(500);
     res.send({error:err});
     console.log("-----------error in signup---------")
     
  }

}));




router.get("/activation/:email/:token",async(req,res)=>{


  const {email,token}=req.params;
  const activationRequester= await User.find({email:email});
  const key =activationRequester[0].passwordHash+activationRequester[0].email;

  // comparing the token from link and the key
  const isMatch=jwt.verify(token,key);

  if(isMatch)
  {
    console.log("----- token matched------")
    
    User.findOneAndUpdate({email:email},{isActivated:true},{new: true,useFindAndModify: false})
    .then((x)=>{res.send({newuser:x,message:"activation success"});
    console.log("activation success !!!")})
    .catch((err)=>{res.send({error:err,message:"activation failed"});
     console.log("activation failed !!!")})

  }
  else{
    ("----- token not matched------")

    res.status(500);
    res.send({message:"error in activation "})
  }

});



//  --------- Log in ---------- 

router.post("/login",async(req,res)=>{

  // getting login details -Input from frontend
   const Input =req.body;
   console.log("Login alert >>>",Input);
 
 try{
 
   const userLoggingIn= await User.find({email:Input.email});
  
   if(userLoggingIn[0].isActivated)
   {
    const isMatch=await bcrypt.compare(Input.password,userLoggingIn[0].passwordHash);
    if(!isMatch)
    {
      res.status(500);
      res.send({message:"---- invalid credentials in POST----"});
      console.log("---- invalid credentials in POST----");
    }
    else
    {
      res.send({loggeduser:userLoggingIn[0],message:"login success !!!"});
      console.log("---- successful login in POST ----");
    }
   }
   else{
     res.send({message:"activation is required"})
   }
  }
  
  catch(err)
  {
    res.status(500);
    res.send(err);
    console.log("Error  !!!");
  }
})





// ------sending one time link to user's mail to change password -----

router.post("/forgotpwd",async(req,res)=>{


  try{
  const pwdrequester= await User.findOne({email:req.body.email});
 console.log("forgot password alert",pwdrequester)


       // JWT secret key in combined with unique old password of user.
    const supersecretKey= pwdrequester.passwordHash;

    const payload={email:pwdrequester.email}
    //signing JWT token

    const token =jwt.sign(payload,supersecretKey);

      User.findOneAndUpdate({email:pwdrequester.email},{randomString:supersecretKey},{new: true,useFindAndModify: false})
      .then((x)=>console.log("user details with string update>>>>>",x))
    
      console.log("token signed ------->>",token)

      const base =req.body.link


   const link= base+"/"+pwdrequester.email+"/"+token;


    console.log("one time link >>>>",link);

//-----sending one time link through mail usig "nodemailer"


    var mailOptions = {
      from: 'one.trial.one.trial@gmail.com',
      to:'one.trial.one.trial@gmail.com',
      subject: 'reset password mail',
      text: link
    };

    transporter.sendMail(mailOptions, function(error, info){
if (error) {
  console.log(error);
} else {
  console.log('Email sent: ' + info.response);
}
});


    res.send({onetimelink:link,email:pwdrequester.email});
  }
catch(err) {
    res.status(500);
    res.send(err.message);
    console.log("Error  !!!");

  }

});



router.get("/resetpwd/:email/:token",async(req,res)=>{

const {email,token}=req.params;
console.log("token received ------->>",token)

 try{
  const pwdrequester= await User.find({email});
console.log("reset password alert !!!",pwdrequester)
   

//----- Verification of received JWT token ------
console.log("random string>>>",pwdrequester[0].randomString)
  
var key=pwdrequester[0].randomString
  const isMatch=jwt.verify(token,key);

  if(isMatch)
  {
    console.log("---token matched in reset request------")
    res.send({email:pwdrequester[0].email});

  }
  

 }
 catch(err){
   res.send(err.message);
   console.log("------token not matched in reset request -----")
 }

 });


//---------- new password post and update -----------

 router.post("/resetpwd/:email/:token",async(req,res)=>{


  const {email,token}=req.params;
  const {pwd,confirmpwd}=req.body

  try{
    const pwdrequester= await User.find({email});
  
  
  //----- Verification of received JWT token ------
  
 
  
    const isMatch=jwt.verify(token,pwdrequester[0].randomString);


  
    if(isMatch&&(pwd==confirmpwd))
{

  const salt=await bcrypt.genSalt(10);

  const passwordHash =await bcrypt.hash(pwd,salt);

      User.findOneAndUpdate({email:pwdrequester[0].email},{passwordHash:passwordHash,randomString:""},{new: true,useFindAndModify: false})
    
    .then((m) => {
        if (!m) {
            return res.status(404).send("error in match");
        }
        else{
            res.send(m);
            console.log("password changed",m)
        }
        
    })
    }

    else{
      console.log("error in password change")
    }
  
   }
   catch(err){
     res.send(err.message);
     console.log("token not matched in reset post >>>>>")
   }



 });



// ----------URL shortening begins---------



//-------listing all urls --------

router.get("/allurls",async(req,res)=>{

  var allurls=await URL.find();
  res.send(allurls);
  
  
  })

//-------creating a short url-----

 router.post("/creaturl",async(req,res)=>{

  let date=new Date();

  var newURL=req.body;
  const url=new URL({
    long:newURL.longUrl,
    createdAt: date.toDateString()
  })


 try{
   //saving the user signing up (before activation)
   const newurl =await url.save();
   console.log("new url entry >>>>",newurl)
   res.send(newurl)
 }
 catch(err)
 {
  res.status(404);
   console.log("error in saving url",err);

 }

 })

//  ---------redirecting short url ----------



router.get("/:shortUrl",async(req,res)=>{

  var url= await URL.findOne({short:req.params.shortUrl}, function(err,doc){

if(err) throw err; 

doc.visitors++;
doc.save();
res.redirect(doc.long);
console.log("redirection success !!!",doc);

  });
});




// ----------URL shortening ends---------

export default router;