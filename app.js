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

app.get("/",(req,res)=>{
    res.send("I am at root");
})

app.get("/allListing",
    wrapAsync(async(req,res)=>{
    const allListing= await Listing.find({});
    res.render("listing/index",{allListing});
}))

// adding new content
app.get("/listing/new",(req,res)=>{
    res.render("listing/addnew")
})

//route for adding new  listing......
app.post("/listing",wrapAsync(async(req,res)=>{
/*    try{
 */    const {title,description,filename,price,location,country}=req.body;
    const newSample=new Listing({
        title:title,
        description:description,
        image:{
            filename:"",
            url:filename,
        },
        price:price,
        location:location,
        country:country,
    })
    await newSample.save();
    res.redirect("/allListing");
 /*   } catch(err){
    next(err);
   } */
}))
// show route
app.get("/listing/:id",
    wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const showListing=await Listing.findById(id);
    res.render("listing/show",{showListing});
}))
//Route for edit
app.get("/listing/:id/edit",
    wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let newData=await Listing.findById(id);
    res.render("listing/edit",{newData});
}))
//route for update data.... or listing
app.put("/listing/:id",
    wrapAsync(async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndUpdate(id,{
    title: req.body.title,
    description: req.body.description,
    image: { url: req.body.imageUrl },
    price: req.body.price,
    location: req.body.location,
    country: req.body.country
    })
    res.redirect(`/listing/${id}`);
}))

//deleteing data....
app.delete("/listing/:id",
    wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const deletedData=await Listing.findByIdAndDelete(id);
    console.log(deletedData);
    res.redirect("/allListing");
}))



app.use((err,req,res,next)=>{
    const {statusCode,message}=err;
    res.status(statusCode).send(message);
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