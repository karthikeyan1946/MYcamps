const mongoose = require('mongoose')
const Schema=mongoose.Schema;
const reviewSchema=new Schema({
    body:'string',
    rating:'number',
    author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
})
const review=mongoose.model('Review',reviewSchema)
module.exports=review