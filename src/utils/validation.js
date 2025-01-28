const validator = require('validator');

const validateSignUpData = (req) =>{
    const {firstName,lastName,emailId, password } =req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid.");
    }
    else if( !validator.isEmail(emailId)){
        throw new Error("Email is not valid.");
    }
    else if(! validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password.")
    }
}

const validatePassword = (password ) =>{
    if(! validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password.")
    }
}

const validateEmail = (email ) =>{
    if(!validator.isEmail(email)){
        throw new Error("Please enter valid email!!");
    }
}


const validateAbout = (about) => {
    if(about.length > 500){
        throw new Error("The Lenght of About is between 0 and 500.");
    }
}

const validateSkills = (skills) => {
    if(skills.length > 10){
        throw new Error("You can add upto 10 skills.");
    }
}

const validateProfileData = (req) =>{

    const allowedEditFields = ["firstName", "lastName","age","gender","photoUrl","about","skills"];

    validateAbout(req.body.about);
    validateSkills(req.body.skills);

    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));

    return isEditAllowed;
}


module.exports = {
    validateSignUpData,
    validateEmail,
    validateProfileData,
    validatePassword,
    
}