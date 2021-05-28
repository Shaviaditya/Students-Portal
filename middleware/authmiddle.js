const jwt = require('jsonwebtoken')
const User = require('../models/users')
const reqauth = (req,res,next)=>{
    const token = req.cookies.LoggedTeacher;
    if(token){
        jwt.verify(token,'secretlogin',(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }else{
                console.log(decodedToken)
                next();
            }
        })
    }
    else{
        res.redirect('/login')
    }
}
const checkuser = (req,res,next)=>{
     const token = req.cookies.LoggedTeacher;
     if(token){
        jwt.verify(token,'secretlogin',async (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            }else{
                console.log(decodedToken)
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }
    else{
        res.locals.user = null;
        next();
    }
}
module.exports = { reqauth,checkuser};