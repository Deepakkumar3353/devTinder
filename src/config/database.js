const mongoose = require('mongoose');
const dotenv = require('dotenv').config();;

const dbConnectionString = process.env.DB_CONNECTION_SECRET;
const connectDB = async()=>{
   
    console.log(dbConnectionString)
    await mongoose.connect(dbConnectionString)
}

module.exports = connectDB;

