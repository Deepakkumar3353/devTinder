const express = require("express");

const app = express();

app.use("/",(req,res)=> {
    res.send("Hello from the server!!1");
})

app.use("/test", (req,res) =>{
    res.send("Hello from the Test!!!")
}) 

app.listen(3000, ()=>{
    console.log("Server is listen on port 3000.....")
})