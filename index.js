const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "ilovekiara";

const app = express();

app.use(express.json());

let users = [];

function authMiddleware(req,res,next){
    let token = req.headers.authorization;
    if(!token){
        return res.status(401).json({message : "No token found - unauthorized!"});
    }
    else{
        jwt.verify(token,JWT_SECRET,(err,decoded)=>{
            if(err){
                return res.status(403).json({message : "Invalid token - forbidden!"});
            }
            else{
                req.user = decoded;
                next();
            }
        })
    }
}

app.post("/signup",(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    users.push({username,password, todos:[]});
    res.json({message : "You have signed up!"});
})

app.post("/signin",(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    let user = users.find(user=>{
        return user.username===username && user.password===password
    })
    if(user){
        const token = jwt.sign({username:username,password:password},JWT_SECRET);
        res.send({message : "You have signed in!",token:token});
    }
    else{
        res.status(403).json({message : "Invalid credentials!"});
    }
})

app.post("/addtodo",authMiddleware,(req,res)=>{
    const username = req.user.username;
    const title = req.body.title;
    users.forEach((user)=>{
        if(user.username===username){
            user.todos.push({title: title, done: false});
        }     
    })
    res.status(200).json({message : `Successfully added todo : ${title}`})
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})