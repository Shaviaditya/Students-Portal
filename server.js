const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/authRoutes')
const routerx = require('./routes/routes')
const routerf = require('./routes/fileRoutes')
const cookieParser = require('cookie-parser')
const {reqauth, checkuser} = require('./middleware/authmiddle');
const {reqauthst,checkuser2} = require('./middleware/authstudent');
require('dotenv').config()
//Setting up Express App
const app = express();

//Middleware
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

//View engine
app.set('view engine','ejs')
//Connecting to the database
const port = process.env.PORT||5000
//const uri = ''
//console.log(uri)
mongoose.connect(process.env.DATABASE_URI,{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(()=>{
    app.listen(port,()=>{
        console.log(`Database Up and running at http://localhost:${port}/`)
    })
})
.catch((err)=>{
    console.log(err)
})


//routes
app.get('/',(req,res)=>{res.render('MainPage')})
app.get('/Teacherportal',reqauth,checkuser,(req,res)=>{res.render('Teacherportal')})
app.get('/Studentportal',reqauthst,checkuser2,(req,res)=>{res.render('Studentportal')})
app.use(router);
app.use(routerx);
app.use(routerf);
