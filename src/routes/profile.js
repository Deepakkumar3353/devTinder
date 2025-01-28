const express = require('express');
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const {validateProfileData,validatePassword} = require('../utils/validation');
const User = require('../models/user');
const bcrypt =require('bcrypt');


profileRouter.get("/profile/view",userAuth, async(req,res) =>{
    try{
       
        const user = req.user;
        res.send(user);
        
    }catch(err){
        res.status(400).send("Error : " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async(req,res) =>{
    try{
        // validate the data
        if(!validateProfileData(req)){
            throw new Error("Invalid Edit Request!!");
        }

        const loggInUser = req.user;
        Object.keys(req.body).forEach(key => loggInUser[key] = req.body[key]);

        await loggInUser.save();

        res.json({
            message: `${loggInUser.firstName} , your profile was updated successfully..`,
            data : loggInUser
        });

    }catch(err) {
        res.status(400).send("Error : " + err.message);
    }
});

profileRouter.patch("/profile/password", async(req,res) =>{

    try{

        const {emailId,newPassword,confirmPassword}=req.body;
        // console.log(emailId,newPassword,confirmPassword)

        const user = await User.findOne({emailId:emailId});
        // console.log(user)

        if(!user){
            throw new Error("User doesn't Exists");
        }

        // validatePassword(newPassword)
        if(newPassword!==confirmPassword){
            throw new Error("New Password and Confirm Password doesn't match.")
        }
        validatePassword(newPassword);

        const newPasswordHash = await bcrypt.hash(newPassword , 10);
        user.password = newPasswordHash;
        await user.save();

        res.json({
            message: ` Password Reset successfully..`,
            data : user
        });

    }catch(err){
        res.status(400).send("Error : " + err.message);
    }
});

module.exports = profileRouter;