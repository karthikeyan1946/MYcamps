const express=require('express')
const router=express.Router()
const passport=require('passport')
const returnTo=require('../middleware/returnTo')
const userMethod=require('../controllers/users')


router.get('/register',userMethod.registerForm)
router.post('/register',userMethod.register)

router.get('/login',userMethod.loginForm)
router.post('/login',returnTo,passport.authenticate('local',{failureFlash: true, failureRedirect:'/login'}),userMethod.login)


router.get('/logout', userMethod.logout);
module.exports=router