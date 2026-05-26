const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "ilovekiara";

const app = express();

app.use(express.static("./public"));

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

    const existingUser = users.find(user=>{
        return user.username === username
    })

    if(existingUser){
        return res.json({message : "Username already taken!"});
    }

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

app.get("/gettodos",authMiddleware,(req,res)=>{
    const username = req.user.username;
    const user = users.find((user)=>{
        return user.username === username
    })
    res.status(200).json({LisOfTodos : user.todos});

})

app.delete("/deletetodo",authMiddleware,(req,res)=>{
    const title = req.body.title;
    const username = req.user.username;
    const user = users.find(user=>{
        return user.username === username
    })
    const newTodos = user.todos.filter((todo)=>{
        return todo.title != title
    })
    user.todos = newTodos;
    res.json({message : `Todo successfully deleted : ${title}`});
})


app.put("/updatetodo",authMiddleware,(req,res)=>{
    const username = req.user.username;
    const title = req.body.title;
    const user = users.find((user)=>{
        return user.username === username;
    })
    user.todos.forEach(todo=>{
        if(todo.title===title){
            todo.done = true;
        }
    })
    res.json({message : `Todo marked as done : ${title}`});
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})