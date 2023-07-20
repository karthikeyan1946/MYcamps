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



const reviewSchema=Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})


const validateReview=(req,res,next)=>{
    /******   with error stack      ****** */

    //console.log(req.body)
    const resvalue=reviewSchema.validate(req.body)
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
        let resvalue=await reviewSchema.validateAsync(req.body) // without error stack
        next()
    }catch(e){
        next(e)
    }*/

}
//JOI server side validations
module.exports=validateReview