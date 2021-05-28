const { Router } = require('express')
const authConstroller = require('../Controllers/authControllers')

//Instantiating the Router Module
const router = Router();

// GET|POST Requests 
router.get('/signup', authConstroller.signup_get);
router.post('/signup',authConstroller.signup_post);
router.get('/login',authConstroller.login_get);
router.post('/login',authConstroller.login_post);
router.get('/logout',authConstroller.logout_get);
module.exports = router;