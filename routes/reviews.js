const express=require('express');
const router=express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync')
const validateReview=require('../SchemaValidate/reviewSchema')
const isloggedin=require('../middleware/isauthenticate')
const isfound=require('../middleware/isfound')
const reviewMethod=require('../controllers/reviews')

router.post('/',isloggedin,isfound,validateReview,catchAsync(reviewMethod.create))


router.delete('/:reviewId',isloggedin,isfound,catchAsync(reviewMethod.delete))


module.exports=router