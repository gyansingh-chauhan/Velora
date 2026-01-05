const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const mongo_url="mongodb://127.0.0.1:27017/velora";
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash")
const listingRouter=require("./routes/listing.js")
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");
const userRouter=require("./routes/user.js")
const loginRouter=require("./routes/login.js")
const logoutRouter=require("./routes/logout.js")

//Connecting to DataBase    



main().then(()=>{
    console.log("Connected to DB")
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(mongo_url);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions={
    secret:"secretCode",
    resave:false,
    saveUninitialized:true,
}
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize())
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
})

app.use("/login",loginRouter);
app.use("/listing",listingRouter); 
app.use("/signup",userRouter);
app.use("/logout",logoutRouter);


app.get("/",(req,res)=>{
    res.send("I am at root");
})

/* app.use("/demoUser",async (req,res)=>{
    let fakeUser=new User({
        email:"gyan@gmail.com",
        username:"ironman",
    })
    let registerUser= await User.register(fakeUser,"sallubhai");
    res.send(fakeUser);

}) */

app.get("/allListing",
    wrapAsync(async(req,res)=>{
    const allListing= await Listing.find({});
    res.render("listing/index",{allListing});
}))













app.use((err,req,res,next)=>{
    const {statusCode,message}=err;
    res.status(404).send(message);
})


/* app.get("/testListings", async (req,res)=>{
    let sampleListing= new Listing({
    title:"My new villa",
    description:"By the beach",
    price:1200,
    location:"Calangute, Goa",
    country:"India",
    });
    await sampleListing.save();
    res.send("new listing added successfully");
}) */



app.listen(8080,()=>{
    console.log("port is listening at 8080");
})