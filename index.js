const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "ilovekiara";

const app = express();

app.use(express.json());

let users = [];

app.post("/signup",(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    users.push({username,password, todos:[]});
    res.json({message : "You have signed up!"});
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})