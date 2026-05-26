const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "ilovekiara";

const app = express();

app.use(express.json());

let users = [];

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})