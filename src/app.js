const express = require("express");
const connectDB = require('./config/database')




const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const app = express();

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');
const userRouter = require('./routes/user');

app.use(express.json());
app.use(cookieParser());

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);






connectDB().then( ()=>{
    console.log("Database connect successfully!!");
    app.listen(5000, ()=>{
        console.log("Server is listen on port 5000.....");
    });
}).catch((err)=>{
    console.error("Database cannot be connect.")
})

