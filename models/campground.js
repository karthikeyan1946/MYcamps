const mongoose = require('mongoose')
const Schema=mongoose.Schema;
const review=require('./review')


const opts = { toJSON: { virtuals: true } };
const CampgroundSchema=new Schema({
    title:'string',
    price:'number',
    description:'string',
    location:'string',
    geometry: {
        type: {
          type: String, 
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    images:[
        {
            url:'string',
            filename:'string'
        }
    ],
    author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
},opts)


CampgroundSchema.post('findOneAndDelete',async function(data){
    await review.deleteMany({
    _id:{
            $in : data.reviews
        }
    })
})
CampgroundSchema.virtual('properties.markup').get(function(){
    return `
    <a href='/campgrounds/${this.id}/show'>${this.title}</a>
    `
})

const campground=mongoose.model('Campground',CampgroundSchema)
module.exports =campground