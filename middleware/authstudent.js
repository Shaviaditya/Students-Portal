const jwt = require('jsonwebtoken')
const User = require('../models/users')
const reqauthst = (req,res,next)=>{
    const token = req.cookies.LoggedStudent;
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
const checkuser2 = (req,res,next)=>{
    const token = req.cookies.LoggedStudent;
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

module.exports = { reqauthst,checkuser2};