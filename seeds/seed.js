const mongoose=require('mongoose')
const cities=require('./cities')
const {descriptors,places}=require('./seedHelpers')
const campground=require('../models/campground')
const axios = require('axios');
const user=require('../models/user')
const indiancities=require('./indiancities')



mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp')
.then(()=>{
    console.log('mongo connection open')
})
.catch((e)=>{
    console.log('mongo error',e)
})
async function getImage(){
        const res=await axios.get('https://api.unsplash.com/photos/random/?client_id=2twI3Q5K59i9Z19mb3KZbMdj1WXXmOq3lpFnkJuuW1g&collections=483251')
        //console.log(data.data.urls.small)
        return res.data.urls.small
    
}
const sample = (array)=> array[Math.floor(Math.random()*array.length)]
const seedDB = async ()=>{
    await campground.deleteMany()
    for (let i = 0; i < 200; i++) {
         const random150 = Math.floor(Math.random() * 150);
         const camp = new campground({
             location: `${indiancities[random150].city}, ${indiancities[random150].admin_name}`,
             title: `${sample(descriptors)} ${sample(places)}`,
             images: [
                {
                  url: 'https://res.cloudinary.com/dvveylzwl/image/upload/v1689352318/yelpcamp/iwppjy8gccm7jib0sbzu.jpg',
                  filename: 'yelpcamp/iwppjy8gccm7jib0sbzu'
                },
                {
                  url: 'https://res.cloudinary.com/dvveylzwl/image/upload/v1689352320/yelpcamp/hna1mbrhb8h4wy21plt2.jpg',
                  filename: 'yelpcamp/hna1mbrhb8h4wy21plt2'
                }
              ],
              description: 'Good place to camp',
              author:'64ae8b07d0958b3f49a58bac',
              geometry:{ type: 'Point', coordinates: [indiancities[random150].lng,indiancities[random150].lat]}

        })
        //console.log(camp);
        await camp.save();
    }
 }
 //addAuthor()
 /*seedDB().then(()=>{
    mongoose.connection.close()
 })*/
 //addgeometry()


