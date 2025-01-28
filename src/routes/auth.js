const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');

const User = require("../models/user")
const {validateSignUpData,validateEmail} = require('../utils/validation')

authRouter.post("/signUp", async (req,res)=>{

    try {
//    console.log(req.body)
// validation
    validateSignUpData(req);

    const {firstName,lastName,emailId,password} = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password , 10);
    
    // console.log(passwordHash)
    // Creating a instance of USer model
    const user = new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash
    });

    
    // Saving the User into databse.
    await user.save();

    res.send("SignUp Successfully!!!");

    }catch (err) {
        res.status(400).send("ERROR : "+ err.message);
    }
    
});

authRouter.post("/login", async (req,res) =>{

    try{
        const {emailId , password } = req.body;

        // validate the email id;
        validateEmail(emailId);

        // Retive the email and passwword from databse.
        const user = await User.findOne({emailId : emailId});
        // console.log(user);

        if(!user){
            throw new Error("Invalid credentials.");
        }

        const isValidPassword = await user.validatePassword(password);
        // console.log(isValidPassword);


        if(!isValidPassword){
            throw new Error("Invalid credentials.")
        }else{

            // Create a JWT token
            const token = await user.getJWT();
            // console.log("token=======",token)

            // Add token to cookie and send the response back tp user

            res.cookie("token",token, {expires : new Date(Date.now() + 1 * 3600000)})

            res.send("Login Successful...");
        }

    }catch(err){
        res.status(400).send("Error : " + err.message);
    }
});

authRouter.post('/logout', (req,res)=>{
    res.cookie("token",null ,{expires:new Date(Date.now())});

    res.send("Logout Successfull!!!");
});


module.exports = authRouter;