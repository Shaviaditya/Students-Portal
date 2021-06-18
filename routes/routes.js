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
const Year = require('../models/YearSchema');
const { request } = require('express');
routerx.use(express.json())
routerx.use(express.urlencoded({extended:true}))
//create a question
routerx.post('/questions',reqauth,checkuser,async (req, res) => {
    try {
        const s = req.body.stream
        const a = req.body.description
        const b  = req.body.option1
        const c = req.body.option2
        const d = req.body.option3
        const e = req.body.option4
        const f = req.body.answer
        const exp = await Question.find({stream:s})
        console.log(exp)
        if(exp.length==0){
            const questions = await Question.create({
                stream: s,
                question: [
                    a,
                    b,
                    c,
                    d,
                    e,
                    f
                ]
            })
            console.log(questions)
            res.redirect('/questions/create')
        } else {
            const check2 = await Question.findById(exp[0]._id) 
            check2.question.push([a,b,c,d,e,f]);
            console.log(check2)
            check2.save();
            res.redirect('/questions/create')
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({"error":error})
    }
})
//Post Student Responses
routerx.post('/stuview',reqauthst,checkuser2,async (req, res) => {
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
            const name = req.body.name
            const answer  = req.body.answer
            const examcode = timer.examsubject 
            for(let i=0;i<answer.length;i++){
                answer[i] = ({"text":answer[i]})
            }
            const question = await Student.create({
                name,
                examcode,
                answer
            })
            console.log(question)
            return res.status(200).redirect('/Studentportal');
        } catch (error) {
            return res.status(500).json({"error":error})
        }
    }
    else if(time1>time3){
        await Timer.deleteOne({id});
        res.render('Timeup_endpt');
    }
    else{
        res.render('Timeup_endpt')
    }
})
routerx.get('/questions/create',reqauth,checkuser,(req,res)=>{
    res.render('Question-Create');
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
    var d;
    const token = req.cookies.LoggedStudent;
    jwt.verify(token,'secretlogin',(err,decodedToken)=>{
        d = decodedToken;
    })
    const idd = d.id;
    const key = await User.findById(idd);
    console.log(key)
    const id = req.params._id;
    const timer = await Timer.findOne({id})
    const requesting = await Response.findOne()
    if(timer==null){
        await Response.findByIdAndDelete(requesting._id);
        res.send('No exam scheduled now');
    }
    else{
        console.log(timer)
        console.log(timer.startslot)
        console.log(timer.endslot)
        var scode = timer.examsubject
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
        if(time1>=time2 && time1<=time3)
        {
            ttime = (end-newdate2)/1000;
            console.log(requesting.response+"0"+key.year)
            if(scode==(requesting.response+"0"+key.year)){
                Question.find({stream:(requesting.response+"0"+key.year)}).sort({createdAt:-1})
                .then(async (result)=>{
                    //temp = (requesting.response+"0"+key.year)
                    await Response.findByIdAndDelete(requesting._id);
                    res.render('Quizviewpage',{'value':ttime,blogs:result[0].question})
                })
                .catch((err)=>{
                    console.log(err);
                })
            }else{
                await Response.findByIdAndDelete(requesting._id);
                res.send('This Subject doesnot have an active exam now');
            }
        }
        else if(newdate2>end){
            await Response.findByIdAndDelete(requesting._id);
            await Timer.deleteOne({id});
            res.render('Timeup_endpt');
        }
        else if(time1<time2){
            if(scode===(requesting.response+"0"+key.year)){
                await Response.findByIdAndDelete(requesting._id);
                res.render('Pre-Quiz_Setup',{'value':(start-newdate2)/1000})
            }else{
                await Response.findByIdAndDelete(requesting._id);
                res.send('This Subject doesnot have an active exam now');
            }
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
    res.render('Settimer')
})
routerx.post('/settime',reqauth,checkuser,async (req,res)=>{
    try{
        const starttime = req.body.starttime
        const endtime = req.body.endtime
        const startday = req.body.startdate
        const endday = req.body.enddate
        const startslot = (startday.toString())+"T"+starttime+"Z"
        const endslot = (endday.toString())+"T"+endtime+"Z"
        const examsubject = req.body.examsubject
        const schedule = await Timer.create({
            startslot,
            endslot,
            examsubject
        })
        console.log(schedule)
        res.redirect('/Teacherportal')
    }
    catch(err){
        const errors = handlerror(err)
        return res.send(errors.startslot);
    }
})

routerx.get('/response',reqauthst,checkuser2,async(req,res)=>{
    var d;
    const token = req.cookies.LoggedStudent;
    jwt.verify(token,'secretlogin',(err,decodedToken)=>{
        d = decodedToken;
    })
    const idd1 = d.id;
    const key = await User.findById(idd1);
    console.log(key)
    const id = req.params._id;
    const requesting1 = await Response.findOne()
    var arr = [],arr2 = [],tmp,arr3=[];
    var cnt = 0;
    tmp = (requesting1.response+"0"+key.year)
    await Question.find({stream:(requesting1.response+"0"+key.year)}).then((iv1)=>{
        try{
            arr = [];
            for(let i=0;i<((iv1[0].question)).length;i++){
                arr.push(((iv1[0].question)[i])[5])
            };
        } catch{
            arr.push(0);
        }
    });
    (await Student.find({examcode:(requesting1.response+"0"+key.year)})).forEach((mydoc2)=>{
        var n = mydoc2.name;
        var co = mydoc2.examcode;
        for(let i=0;i<(mydoc2.answer).length;i++){
            if(arr[i]==(((mydoc2.answer)[i].text))){
                cnt = cnt + 1; 
            }
        }
        arr2.push({n,cnt})
        cnt = 0;
    });
    for(let i=0;i<arr2.length;i++){
        JSON.stringify(arr2[i])
    }
    await Response.findByIdAndDelete(requesting1._id);
    res.render('ResultsPage',{'studentlist' : arr2,'subject': tmp});
})
routerx.get('/end2',checkuser2,(req,res)=>{
    res.render('Pre-Quiz_Setup');
})
routerx.get('/subject/create',reqauth,checkuser,(req,res)=>{
    res.render('Createnew_subject')
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
routerx.get('/examsubjects',reqauthst,checkuser2,async (req,res)=>{
    await Subject.find((err,data)=>{
        if(err){
            console.log(err)
        } else if(data.length>0){
            res.render('examsubjects',{data:data})
        } else {
            res.render('examsubjects',{data:{}})
        }
    })
})
routerx.post('/examsubject/data',reqauthst,checkuser2,async (req,res)=>{
    await Response.remove({});
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
    res.redirect('/stuview')
})
routerx.post('/subject/data',reqauthst,checkuser2,async (req,res)=>{
    await Response.remove({});
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
                res.render('FileDownloadRoute',{data:data})
            }
            else{
                await Response.findByIdAndDelete(id2);
                res.render('FileDownloadRoute',{data:{}})
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
    await Response.remove({});
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
                res.render('Uploadednotesviewer',{data:data})
            }
            else{
                await Response.findByIdAndDelete(id2);
                res.render('Uploadednotesviewer',{data:{}})
            }
        })
    } else {
        res.redirect('/Teacherportal')
    }
})
routerx.get('/resultcheck',reqauthst,checkuser2,async (req,res)=>{
    await Subject.find((err,data)=>{
        if(err){
            console.log(err)
        } else if(data.length>0){
            res.render('resultcheck',{data:data})
        } else {
            res.render('resultcheck',{data:{}})
        }
    })
})
routerx.post('/resultcheck/data',reqauthst,checkuser2,async (req,res)=>{
    await Response.remove({});
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
    res.redirect('/response')
})
routerx.get('/midyear',(req,res)=>{
    res.render('midyear')
})
routerx.post('/midyear',reqauth,checkuser,async (req,res)=>{
    await Year.remove({});
    var y = req.body.year
    var temp = new Year({
        year:y
    })
    temp.save((err,data)=>{
        if(err){
            console.log(err)
        }
    })
    res.redirect('/subjects2')
})
routerx.get('/subjects2',reqauth,checkuser,async (req,res)=>{
    await Subject.find((err,data)=>{
        if(err){
            console.log(err)
        } else if(data.length>0){
            res.render('subjects2',{data:data})
        } else {
            res.render('subjects2',{data:{}})
        }
    })
})
routerx.post('/subject2/data',reqauth,checkuser,async (req,res)=>{
    await Response.remove({});
    var x = req.body.response
    var temp = new Response({
        response:x
    })
    temp.save((err,data)=>{
        if(err){
            console.log(err)
        }
    })
    res.redirect('/resultcheck2')
})
routerx.get('/resultcheck2',reqauth,checkuser,async(req,res)=>{
    var requesting2 = await Response.findOne();
    var getyear = await Year.findOne();
    var arr = [],arr2 = [],tmp,arr3=[];
    var cnt = 0;
    /*
    (await Student.find()).forEach((mydoc2)=>{
        var n1 = mydoc2.examcode;
        tmp = n1
    });
    */
    tmp = (requesting2.response+"0"+getyear.year)
    await Question.find({stream:(requesting2.response+"0"+getyear.year)}).then((iv1)=>{
        try{
            arr = [];
            for(let i=0;i<((iv1[0].question)).length;i++){
                arr.push(((iv1[0].question)[i])[5])
            };
        } catch{
            arr.push(0);
        }
    });
    (await Student.find({examcode:(requesting2.response+"0"+getyear.year)})).forEach((mydoc2)=>{
        var n = mydoc2.name;
        var co = mydoc2.examcode;
        for(let i=0;i<(mydoc2.answer).length;i++){
            if(arr[i]==(((mydoc2.answer)[i].text))){
                cnt = cnt + 1; 
            }
        }
        arr2.push({n,cnt})
        cnt = 0;
    });
    for(let i=0;i<arr2.length;i++){
        JSON.stringify(arr2[i])
    }
    await Response.remove({});
    res.render('ResultsPage',{'studentlist' : arr2,'subject': tmp});
})
module.exports = routerx;
