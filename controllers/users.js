const user=require('../models/user')


module.exports.registerForm=(req,res)=>{
    res.render('users/register',{title:'register'})
}
module.exports.register=async (req,res,next)=>{
    try{
        let {username,email,password}=req.body;
        let newUser=new user({email,username})
        let registeredUser=await user.register(newUser,password)
        //console.log(registeredUser)
        req.login(registeredUser,(e)=>{
            if(e){
                next(e)
            }else{
                req.flash('success','welcome to yelpcamp')
                res.redirect('/campgrounds')
            }
        })
        
    }catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
    
}
module.exports.loginForm=(req,res)=>{
    res.render('users/login',{title:'login'})
}
module.exports.login=(req,res)=>{
    const redirectUrl=res.locals.returnTo
    //console.log(res.locals)
    //console.log(req.session)
    req.flash('success','welcome back')
    res.redirect(redirectUrl)
}
module.exports.logout=(req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}