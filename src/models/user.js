const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName : {
        type:String,
        requird:true,
        index:true,
        minLength:4

    },
    lastName : {
        type : String
    },
    emailId : {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address : "+value)
            }
        }
    },
    password : {
        type : String,
        required:true,
        validate(value) {
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong Password.")
            }
        }
    },
    age : {
        type:Number,
        min:18
    },
    gender : {
        type : String,
        enum : {
            values:["male","female"],
            message:` {VALUE} is invalid gender type`
        }
        // validate(value){
        //     if(!["male","female","others"].includes(value)){
        //         throw new Error("Gender data is not valid..")
        //     }
        // }
    },
    photoUrl : {
        type:String,
        default : "https://www.vecteezy.com/vector-art/45944199-male-default-placeholder-avatar-profile-gray-picture-isolated-on-background-man-silhouette-picture-for-user-profile-in-social-media-forum-chat-greyscale-illustration",
        validate(value) {
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL : "+value)
            }
        }

    },
    about:{
        type:String,
        default:"This the about for the user."

    },
    skills:{
        type:[String]
    }
}, {timestamps:true});


userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({_id : user._id}, "Dev@Tinder$123" , {expiresIn :'1d'});

    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    
    const user = this;
    const passwordHash = user.password;


    const isValidaPassword = bcrypt.compare(passwordInputByUser , passwordHash);

    return isValidaPassword;
}


const User = mongoose.model("User",userSchema);

module.exports = User;