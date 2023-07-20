const campground=require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken=process.env.MAPBOX_TOKEN
const geocoding=mbxGeocoding({accessToken : mapBoxToken})



module.exports.index= async (req,res)=>{
    let campgrounds=await campground.find({});
    //console.log(campgrounds)
    res.render('campgrounds/index',{campgrounds,title:'index'})
}

module.exports.show= async (req,res,next)=>{
    let id=req.params.id
    let found=await campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }
    ).populate('author')
    //console.log(found)
    res.render('campgrounds/show',{found,title:'show'})
    
}

module.exports.createForm=(req,res)=>{
    res.render('campgrounds/new',{title:'new'})
}
module.exports.create=async (req,res,next)=>{
    const out=await geocoding.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
      }).send()
    //console.log(out.body.features[0].geometry);
    let body=req.body.campground
    //console.log(req.files,req.body);
    let newCamp=new campground(body)
    newCamp.author=req.user.id
    newCamp.images=req.files.map((f)=>{ 
        return {url: f.path,filename:f.filename}
    })
    newCamp.geometry=out.body.features[0].geometry
    await newCamp.save()
    //console.log(newCamp)
    req.flash('success','successfully added your campground')
    res.redirect(`/campgrounds/${newCamp.id}/show`)
}

module.exports.editForm=async (req,res,next)=>{
    let id=req.params.id
    let found=await campground.findById(id)
    res.render('campgrounds/edit',{found,title:'edit'})
    
}
module.exports.edit=async (req,res,next)=>{
    let {id}=req.params
    let updateCamp=req.body.campground
    let found=await campground.findByIdAndUpdate(id,updateCamp)
    req.files.map((f)=>{ 
        found.images.push({url: f.path,filename:f.filename})
    })
    const out=await geocoding.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
      }).send()
    found.geometry=out.body.features[0].geometry
    await found.save()
    req.flash('success','successfully edited your campground')
    res.redirect(`/campgrounds/${id}/show`)
    
}

module.exports.delete=async (req,res)=>{
    let {id}=req.params
    await campground.findByIdAndDelete(id)
    req.flash('success','successfully deleted your campground')
    res.redirect('/campgrounds')
    
}