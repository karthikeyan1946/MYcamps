module.exports = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash('error','you must be logged in')
        res.redirect('/login')
    }else{
        next();
    }
}