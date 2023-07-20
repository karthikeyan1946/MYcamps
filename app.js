 if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
//require('dotenv').config()



const express=require('express')
const path=require('path')
const mongoose=require('mongoose')
const methodOverride = require('method-override')
const ejsmate=require('ejs-mate')
const appError=require('./utils/appError')
const campgroundRouter=require('./routes/campground')
const reviewRouter=require('./routes/reviews')
const userRouter=require('./routes/users')
const session = require('express-session')
const flash=require('connect-flash')
const passport=require('passport')
const local=require('passport-local')
const user=require('./models/user')
const helmet=require('helmet')
const mongoDBstore=require('connect-mongo')
const allowedUrls=require('./utils/helmet/allowedUrls')


const dbUrl=process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelpcamp'
//const dbUrl='mongodb://127.0.0.1:27017/yelpcamp'
mongoose.connect(dbUrl)
.then(()=>{
    console.log('mongo connection open')
})
.catch((e)=>{
    console.log('mongo error',e)
})


const app=express()


app.engine('ejs',ejsmate)

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))






const store=mongoDBstore.create({
    mongoUrl: dbUrl,
    touchAfter: 24*60*60,
    crypto:{
        secret: 'thisismysecret'
    }
})
store.on('error',function (e){
    console.log('session store error',e)
})
const secret=process.env.SECRET || 'thisismysecret'
const sessionConfig={
    store,
    name: 'code-red',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000
    }
}

app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(session(sessionConfig))
app.use(flash())
app.use(helmet())



app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...allowedUrls.connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...allowedUrls.scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...allowedUrls.styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dvveylzwl/",
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...allowedUrls.fontSrcUrls],
        },
    })
);


app.use(passport.initialize())
app.use(passport.session());

passport.use(new local(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

app.use((req,res,next)=>{
    
    res.locals.currentUser=req.user
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    //console.log(res.locals.message)
    next()
})

app.use('/campgrounds',campgroundRouter)
app.use('/campgrounds/:id/reviews',reviewRouter)
app.use('/',userRouter)


app.get('/',(req,res)=>{
    res.render('home',{title:'home'})
})



app.all('*',(req,res,next)=>{
    next(new appError('page not found',404))
})
app.use((err,req,res,next)=>{
    //console.dir(err)
    if(!err.status){
        err.status=404
    }
    if(!err.message){
        err.message='Unknown error'
    }
    //console.log(err)
    res.status(err.status).render('error',{err,title:'error'})
})

app.listen(3000,(req,res)=>{
    console.log('port on 3000')
})