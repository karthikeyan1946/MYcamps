const BaseJoi=require('joi')
const appError=require('../utils/appError')
const sanitizeHtml=require('sanitize-html')


const extension =(joi)=>({
    type:'string',
    base: joi.string(),
    messages:{
        'string.escapeHTML': '{{#label}} must not include HTML'
    },
    rules:{
        escapeHTML:{
            validate(value,helpers){
                const clean=sanitizeHtml(value,{
                    allowedTags:[],
                    allowedAtttributes:{},
                });
                if(clean !== value) return helpers.error('string.escapeHTML',{value})
                return clean;
            }
        }
    }
})
const Joi=BaseJoi.extend(extension)

const campgroundSchema=Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().min(0).required(),
        description: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        //image: Joi.string().required()
    }).required()
  

}).required()

const validateCampground= (req,res,next)=>{
    /******   with error stack      ****** */
    //console.log(req.body.campground)
    const resvalue=campgroundSchema.validate(req.body)
    let {error}=resvalue;
    //console.log(resvalue);
    
    
    if(error){
        let mess=error.details.map(m=>m.message).join(',')
        throw new appError(mess,404)
    }else{
       next()
    }
    /*****          *****           ***** */
    /*try{
        let resvalue=await campgroundSchema.validateAsync(req.body) // without error stack  change to async function
        next()
    }catch(e){
        next(e)
    }*/
    
}
//JOI server side validations
module.exports=validateCampground