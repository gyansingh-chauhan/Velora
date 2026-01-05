const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError.js");
const flash=require("connect-flash");
const Listing=require("../models/listing");
const methodOverride=require("method-override");
const {isLoggedIn}=require("../middleware.js");


// adding new content
router.get("/new",isLoggedIn,(req,res)=>{
    
    res.render("listing/addnew.ejs");
  
})

//route for adding new  listing......
router.post("/",wrapAsync(async(req,res)=>{
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
    req.flash("success","New listing added successfully");
    res.redirect("/allListing");
 /*   } catch(err){
    next(err);
   } */
}))
// show route
router.get("/:id",
    wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const showListing=await Listing.findById(id);
    res.render("listing/show",{showListing});
}))
//Route for edit
router.get("/:id/edit",isLoggedIn,
    wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let newData=await Listing.findById(id);
     
    res.render("listing/edit",{newData});
}))
//route for update data.... or listing
router.put("/:id",
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
    req.flash("success","Listing edited  successfully");
    res.redirect(`/listing/${id}`);
}))

//deleteing data....
router.delete("/:id",isLoggedIn,
    wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const deletedData=await Listing.findByIdAndDelete(id);
    console.log(deletedData);
    req.flash("success","Listing deleted  successfully");
    res.redirect("/allListing");
}))

module.exports=router;