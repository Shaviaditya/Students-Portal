const express = require('express')
const routerf = express.Router();
const {reqauth, checkuser} = require('../middleware/authmiddle');
const {reqauthst,checkuser2} = require('../middleware/authstudent');
const fileModel = require('../models/filex');
const mongoose = require('mongoose');
const multer = require('multer');
const jwt = require('jsonwebtoken')
const User = require('../models/users');
const Response = require('../models/userreq')
routerf.use(express.json())
routerf.use(express.urlencoded({extended:true}))
//Setting up storage
const fileStorageEngine = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
const upload = multer({storage: fileStorageEngine});
routerf.get('/route1',reqauth,checkuser,(req,res)=>{
    fileModel.find((err,data)=>{
        console.log(data)
        if(err){
            console.log(err)
        }
        else if(data.length>0){
            res.render('route1',{data:data})
        }
        else{
            res.render('route1',{data:{}})
        }
    })
})
routerf.post('/route1',reqauth,upload.single("file"),async (req,res)=>{
    var x = '/uploads/'+req.file.originalname;
    var y = req.body.subjectcode;
    var z = req.body.year;
    var check1 = await fileModel.find({subjectcode:y,year:z})
    console.log(check1)
    if(check1.length==0){ 
        var temp = new fileModel({
            subjectcode:y,
            year:z,
            filepath:[x]
        })
        temp.save((err,data)=>{
            if(err){
                console.log(err)
            }
            res.redirect('/Teacherportal')
        })
    } else {
        const check2 = await fileModel.findById(check1[0]._id)
        check2.filepath.push(x);
        console.log(check2)
        check2.save();
        res.redirect('/Teacherportal')
    }
})
routerf.get('/download/:num/:id',(req,res)=>{
    fileModel.find({_id:req.params.id},(err,data)=>{
         if(err){
             console.log(err)
         }
         else{
             const name = (__dirname.slice(0,(((__dirname).length)-7)));
             var x= name+data[0].filepath[req.params.num];
             console.log(x);
             res.download(x)
         }
    })
})
/*
routerf.get('/subject/data',checkuser2,reqauthst,(req,res)=>{
    res.send('Hello')
})
routerf.get('/router2',checkuser2,reqauthst,async (req,res)=>{
    var d;
    const token = req.cookies.LoggedStudent;
    jwt.verify(token,'secretlogin',(err,decodedToken)=>{
        d = decodedToken;
    })
    const id = d.id;
    const key = await User.findById(id);
    const requester = await Response.findOne();
    console.log(requester.response)
    fileModel.find({year:key.year},{subjectcode:requester.response},(err,data)=>{
        console.log(data)
        if(err){
            console.log(err)
        }
        else if(data.length>0){
            res.render('route2',{data:data})
        }
        else{
            res.render('route2',{data:{}})
        }
    })
})
*/
module.exports = routerf;