const review=require('../models/review')
const campground=require('../models/campground')


module.exports.create= async (req,res,next)=>{
    let {id}=req.params;
    //console.log(req.body)
    let r=req.body.review;
    const foundCampground=await campground.findById(id)
    const newReview=new review(r);
    newReview.author=req.user.id
    foundCampground.reviews.push(newReview);
    await foundCampground.save()
    await newReview.save()
    req.flash('success','successfully added your review')
    res.redirect(`/campgrounds/${id}/show`)
}

module.exports.delete=async (req,res,next)=>{
    const {id,reviewId}=req.params;
    let found=await review.findById(reviewId)
    if(!found){
        req.flash('error','cannot find your requested review')
        res.redirect(`/campgrouns/${id}/show`)
    }else{
        if(!found.author.equals(req.user.id)){
            req.flash('error','you do not have access')
            res.redirect(`/campgrounds/${id}/show`)
        }else{
            await campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
            await review.findByIdAndDelete(reviewId)
            req.flash('success','successfully deleted your review')
            res.redirect(`/campgrounds/${id}/show`)
        }
    }
    
   
}