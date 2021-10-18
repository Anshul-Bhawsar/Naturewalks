if(process.env.NODE_ENV !== "production"){
    require('dotenv').config(); 
}

console.log(process.env.SECRET);

const express = require('express');
const app = express();
const path=require("path");
const ejsMate =require('ejs-mate');
const mongoose = require('mongoose');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const User = require('./models/user');
const passport = require('passport');
const localStrategy = require('passport-local');
const userRoutes = require('./routes/users');
const naturewalkRoutes = require('./routes/naturewalk');
const naturewalkReviewRoutes = require('./routes/review');


mongoose.connect('mongodb://localhost:27017/manyone', {useNewUrlParser: true,useCreateIndex: true, useUnifiedTopology: true, useFindAndModify : false})
    .then(()=>{
        console.log("MONGO CONNECTION ESTABLISHED!!! FOR NatureWalks");
    })
    .catch(err =>{
        console.log("MONGO OH NOO ERROR!!!! FOR NatureWalks");
        console.log(err);
    });

app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

const sessionConfig = {
    secret : 'qwerty1234',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
app.use((req,res,next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    console.log( "Request.user : " + req.user);
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next(); 
})

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/naturewalk', naturewalkRoutes);
app.use('/', naturewalkReviewRoutes)
app.use('/user', userRoutes)

// app.get('/regiter')

app.get('/',(req,res)=>{
    res.render('first')
})
app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404));
})

app.use((err,req,res,next)=>{
    const { statusCode = 500} = err;
    if(!err.message) {err.message = 'Oh No Something Went Wrong';}
    res.status(statusCode).render('error',{ err });
});

app.listen(3000,(req,res)=>{
    console.log("NatureWalks App Started at Port 3000");
})

// const validateReview = (req,res,next)=>{
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 404)
//     }else{
//         next();
//     }
// }