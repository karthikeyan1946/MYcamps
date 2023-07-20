module.exports=(req,res,next)=>{
    res.locals.returnTo=req.session.returnTo || '/campgrounds' //req.session.returnTo stored in isauthenticate.js
    next()
}