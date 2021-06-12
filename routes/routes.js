const express = require('express');
const { findOne } = require('../models/Question');
const Timer = require('../models/TimeSchema')
const routerx = express.Router()
const {reqauth,checkuser} = require('../middleware/authmiddle');
const {reqauthst,checkuser2} = require('../middleware/authstudent');
const Question = require('../models/Question');
const Student = require('../models/StudentRes')
const Subject = require('../models/subject')
const Response = require('../models/userreq')
const jwt = require('jsonwebtoken')
const fileModel = require('../models/filex');
const User = require('../models/users');
const { request } = require('express');
routerx.use(express.json())
routerx.use(express.urlencoded({extended:true}))
//create a question
var arrC = []
global.requester = "";
routerx.post('/questions',reqauth,async (req, res) => {
    try {
        const { description } = req.body
        const { option1 } = req.body
        const { option2 } = req.body
        const { option3 } = req.body
        const { option4 } = req.body
        const { answer } = req.body
        arrC.push(answer);
        const question = await Question.create({
            description,
            option1,
            option2,
            option3,
            option4,
            answer
        })
        console.log(question)
        res.redirect('/questions/create')
    } catch (error) {
        console.log(error)
        return res.status(500).json({"error":error})
    }
})
//Post Student Responses
routerx.post('/stuview',reqauthst,async (req, res) => {
    const id = req.params._id;
    const timer = await Timer.findOne({id})
    console.log(timer)
    var isodate = new Date().toISOString()

    var time1 = new Date(isodate).toLocaleTimeString('en',{timestyle:'short',hour12:false,timeZone:'Asia/Kolkata'});
    var start = timer.startslot
    var time2 = new Date(start).toLocaleTimeString('en',{timestyle:'short',hour12:false,timeZone:'UTC'});
    var end = timer.endslot
    var time3 = new Date(end).toLocaleTimeString('en',{timestyle:'short',hour12:false,timeZone:'UTC'});
    if(time1>=time2 && time1<=time3)
    {
        try {
            const { name } = req.body
            const { answer } = req.body
            console.log(answer)
            for(let i=0;i<answer.length;i++){
                answer[i] = ({"text":answer[i]})
            }
            const question = await Student.create({
                name,
                answer
            })
            console.log(question)
            return res.status(200).redirect('/response');
        } catch (error) {
            return res.status(500).json({"error":error})
        }
    }
    else if(time1>time3){
        await Timer.deleteOne({id});
        res.render('end');
    }
    else{
        res.render('end')
    }
})
routerx.get('/questions/create',reqauth,checkuser,(req,res)=>{
    res.render('create');
})
//get all questions
routerx.get('/questions',reqauth,async (req,res)=>{
    try {
        const question = await Question.find();
        return res.status(200).json(question);
    } catch (error) {
        return res.status(400).json({'error':error})
    }

})
//get one question
routerx.get('/questions/:id',reqauth,async (req,res)=>{
    const id = req.params._id;
    const question = await Question.findOne({id})
    try {
        if(!question){
            return res.status(404).json({})
        }
        else{
            return res.status(200).json(question)
        }
    } catch (error) {
        return res.status(400).json({'error':error})
    }


})
//update a question
routerx.put('/questions/:id',reqauth,async (req,res)=>{
    const id = req.params._id;
    const {description,answer} = req.body
    let question = await Question.findOne({id});
    try{
        if(!question){
            question = await Question.create({
                description,answer
            })
            return res.status(201).json(question)
        }
        else{
            question.description = description;
            question.answer = answer;
            const result = await question.save();
            return res.status(200).json(result)
        }
    }
    catch(err){
        return res.status(400).json({'err':err})
    }
})
//delete a question
routerx.delete('/questions/:id',reqauth,async (req,res)=>{
    try {
        const _id = req.params.id 

        const question = await Question.deleteOne({_id})

        if(question.deletedCount === 0){
            return res.status(404).json()
        }else{
            return res.status(204).json()
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})
//student question viewer
routerx.get('/stuview',reqauthst,checkuser2,async (req,res)=>{
    const id = req.params._id;
    const timer = await Timer.findOne({id})
    if(timer==null){
        res.send('No exam scheduled now');
    }
    else{
        console.log(timer)
        console.log(timer.startslot)
        console.log(timer.endslot)
        var isodate = new Date().toISOString()
        var date1 = new Date();
        var newdate1 = new Date(date1.getTime()-(date1.getTimezoneOffset()*60000)).toISOString();
        var time1 = new Date(isodate).toLocaleTimeString('en',{timestyle:'short',hour12:false,timeZone:'Asia/Kolkata'});
        var start = timer.startslot
        var time2 = new Date(start).toLocaleTimeString('en',{timestyle:'short',hour12:false,timeZone:'UTC'});
        var end = timer.endslot
        var time3 = new Date(end).toLocaleTimeString('en',{timestyle:'short',hour12:false,timeZone:'UTC'});
        var ttime = (end - start)/1000;
        console.log(start)
        console.log(end)
        var newdate2 = new Date(newdate1)
        console.log(newdate2)
        console.log(time1)
        console.log(time2)
        console.log(time3)
        if(time1>=time2 && time1<=time3)
        {
            ttime = (end-newdate2)/1000;
            Question.find().sort({createdAt:-1})
            .then((result)=>{
                res.render('stuview',{'value':ttime,blogs:result})
            })
            .catch((err)=>{
                console.log(err);
            })
        }
        else if(newdate2>end){
            await Timer.deleteOne({id});
            res.render('end');
        }
        else if(time1<time2){
            res.render('end2',{'value':(start-newdate2)/1000})
        }
    }
});
const handlerror = (err)=>{
    let error = {startslot:'',endslot:''}
    if(err.code===11000){
        error.startslot = 'This timeslot is already in use';
        return error;
    }
    return error;
}
routerx.get('/settime',reqauth,checkuser,(req,res)=>{
    res.render('settimer')
})
routerx.post('/settime',reqauth,async (req,res)=>{
    try{
        const starttime = req.body.starttime
        const endtime = req.body.endtime
        const startday = req.body.startdate
        const endday = req.body.enddate
        const startslot = (startday.toString())+"T"+starttime+"Z"
        const endslot = (endday.toString())+"T"+endtime+"Z"
        const schedule = await Timer.create({
            startslot,
            endslot
        })
        res.redirect('/Teacherportal')
    }
    catch(err){
        const errors = handlerror(err)
        return res.send(errors.startslot);
    }
})
routerx.get('/response',async(req,res)=>{
    const arr = [],arr2 = [];
    (await Question.find()).forEach((mydoc)=>{
        arr.push(mydoc.answer)
    })
    var cnt = 0;
    (await Student.find()).forEach((mydoc2)=>{
        var n = mydoc2.name;
        for(let i=0;i<(mydoc2.answer).length;i++){
            if(arr[i]==(((mydoc2.answer)[i].text))){
                cnt = cnt + 1; 
            }
        }
        arr2.push({n,cnt})
        cnt = 0;
    })
    for(let i=0;i<arr2.length;i++){
        JSON.stringify(arr2[i])
    }
    res.render('resultlist',{'studentlist' : arr2} );
})
routerx.get('/end2',checkuser2,(req,res)=>{
    res.render('end2');
})
routerx.get('/subject/create',reqauth,checkuser,(req,res)=>{
    res.render('subjectcreate')
})
routerx.post('/subject/create',reqauth,checkuser,(req,res)=>{
    var x = req.body.subject
    var y = req.body.name
    var temp = new Subject({
        name: y,
        subject:x
    })
    temp.save((err,data)=>{
        if(err){
            console.log(err)
        }
        res.redirect('/subject/create')
    })
})
routerx.get('/subjects',reqauthst,checkuser2,async (req,res)=>{
    await Subject.find((err,data)=>{
        if(err){
            console.log(err)
        } else if(data.length>0){
            res.render('subjects',{data:data})
        } else {
            res.render('subjects',{data:{}})
        }
    })
})
routerx.post('/subject/data',reqauthst,checkuser2,async (req,res)=>{
    var x = req.body.response
    console.log(x);
    var temp = new Response({
        response:x
    })
    temp.save((err,data)=>{
        if(err){
            console.log(err)
        }
    })
    res.redirect('/subject/data')
})
routerx.get('/subject/data',checkuser2,reqauthst,async (req,res)=>{
    var d;
    const token = req.cookies.LoggedStudent;
    jwt.verify(token,'secretlogin',(err,decodedToken)=>{
        d = decodedToken;
    })
    const id = d.id;
    const key = await User.findById(id);
    const requester = await Response.findOne()
    if(requester!=null){
        const id2 = requester._id;
        console.log(id2);
        fileModel.find({year:key.year,subjectcode:requester.response},async (err,data)=>{
            console.log(data)
            if(err){
                console.log(err)
            }
            else if(data.length>0){
                await Response.findByIdAndDelete(id2);
                res.render('route2',{data:data})
            }
            else{
                await Response.findByIdAndDelete(id2);
                res.render('route2',{data:{}})
            }
        })
    } else {
        res.redirect('/Studentportal');
    }
})



//Teacher check notes route
routerx.get('/subjects1',reqauth,checkuser,async (req,res)=>{
    await Subject.find((err,data)=>{
        if(err){
            console.log(err)
        } else if(data.length>0){
            res.render('subjects1',{data:data})
        } else {
            res.render('subjects1',{data:{}})
        }
    })
})
routerx.post('/subject1/data',reqauth,checkuser,async (req,res)=>{
    var x = req.body.response
    var temp = new Response({
        response:x
    })
    temp.save((err,data)=>{
        if(err){
            console.log(err)
        }
    })
    res.redirect('/subject1/data')
})
routerx.get('/subject1/data',checkuser,reqauth,async(req,res)=>{
    const requester2 = await Response.findOne()
    const id2 = requester2._id;
    if(requester2!=null){
        fileModel.find({subjectcode:requester2.response},async (err,data)=>{
            console.log(data)
            if(err){
                console.log(err)
            }
            else if(data.length>0){
                await Response.findByIdAndDelete(id2);
                res.render('route3',{data:data})
            }
            else{
                await Response.findByIdAndDelete(id2);
                res.render('route3',{data:{}})
            }
        })
    } else {
        res.redirect('/Teacherportal')
    }
})
module.exports = routerx;
