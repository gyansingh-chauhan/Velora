const express=require("express");
const router=express.Router();
const User=require("../models/user.js")


router.get("/",(req,res)=>{
    res.render("./users/signup.ejs")
})


router.post("/",async (req,res)=>{
    try{
    let {username,email,password}=req.body;
    let newUser=new User({username,email})
    let registeredUser= await User.register(newUser,password);
    req.login(registeredUser,err=>{
        if(err) {
            return next(err);
        }
        req.flash("success","Welcome to Velora")
        res.redirect(res.locals.redirectUrl);
       /*  res.redirect(req.session.redirectUrl); */
    })

    
    }
    catch(e){
        req.flash("success","something went wrong")
        res.redirect("/signup")
    }
})


module.exports=router;