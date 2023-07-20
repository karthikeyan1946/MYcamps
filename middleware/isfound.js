const campground=require('../models/campground')

module.exports = async (req,res,next)=>{
    let {id}=req.params;
    let found=await campground.findById(id)
    if(!found){
        req.flash('error','cannot find your requested camp')
        res.redirect('/campgrounds')
    }else{
        next()
    }
}