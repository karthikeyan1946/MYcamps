const campground=require('../models/campground')

module.exports = async (req,res,next)=>{
    let {id}=req.params;
    let found=await campground.findById(id)
    if(!found.author.equals(req.user.id)){
        req.flash('error','you do not have access')
        res.redirect(`/campgrounds/${id}/show`)
    }else{
        next();
    }
}