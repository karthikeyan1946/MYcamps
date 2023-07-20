const express=require('express');
const router=express.Router();
const catchAsync = require('../utils/catchAsync');
const validateCampground=require('../SchemaValidate/campgroundSchema')
const isloggedin=require('../middleware/isauthenticate')
const isfound=require('../middleware/isfound')
const isauthor=require('../middleware/isauthor')
const campgroundMethod=require('../controllers/campground')
const multer=require('multer')
const {storage}=require('../cloudinary/storage')
const upload=multer({storage})

router.get('/',catchAsync(campgroundMethod.index))


router.get('/:id/show',isloggedin,isfound,catchAsync(campgroundMethod.show))


router.get('/new',isloggedin, campgroundMethod.createForm)
router.post('/',isloggedin,upload.array('image'),validateCampground,catchAsync(campgroundMethod.create))


router.get('/:id/edit',isloggedin,isfound,isauthor,catchAsync(campgroundMethod.editForm))
router.patch('/:id',isloggedin,isfound,isauthor,upload.array('image'),validateCampground,catchAsync(campgroundMethod.edit))


router.delete('/:id',isloggedin,isfound,isauthor,catchAsync(campgroundMethod.delete))


module.exports=router