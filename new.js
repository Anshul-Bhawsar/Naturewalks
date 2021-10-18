
const express = require('express');
const app = express();
const session = require('express-session');
const sessionOptions = { secret : 'qwerty1234' , resave : false, saveUninitialized : false};
app.use(session(sessionOptions));


app.get('/viewcount',(req,res)=>{
    if(req.session.count){
        req.session.count +=1;}
        else{
            req.session.count = 1;
        }
        console.log(req.session);
    res.send(`You hav visited ${req.session.count} times`);
})

app.get('/register',(req,res)=>{
    const { username = 'Unknown' } = req.query;
    req.session.username = username; 
    res.redirect('/greet');
})

app.get('/greet',(req,res)=>{
    const { username } = req.session;
    res.send(`Hello, ${username} Welcome to Website!!!!!`);
})

app.listen(3000,(req,res)=>{
    console.log('Serving');
})