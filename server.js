const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/authRoutes')
const routerx = require('./routes/routes')
const routerf = require('./routes/fileRoutes')
const cookieParser = require('cookie-parser')
const {reqauth, checkuser} = require('./middleware/authmiddle');
const {reqauthst,checkuser2} = require('./middleware/authstudent');

//Setting up Express App
const app = express();

//Middleware
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

//View engine
app.set('view engine','ejs')
//Connecting to the database
const URL = 'mongodb+srv://Mongoose55:Wifi5757@cluster0.ydfmd.mongodb.net/myFirstDatabase';
mongoose.connect(URL,{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(()=>{
    app.listen(5700)
    console.log(`Database Up and running at http://localhost:5700/`)
})
.catch((err)=>{
    console.log(err)
})


//routes
app.get('/',(req,res)=>{res.render('home')})
app.get('/Teacherportal',reqauth,checkuser,(req,res)=>{res.render('Teacherportal')})
app.get('/Studentportal',reqauthst,checkuser2,(req,res)=>{res.render('Studentportal')})
app.use(router);
app.use(routerx);
app.use(routerf);