const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.post(
  "/",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    req.flash("success", "Welcome back to Velora");
   /*  res.redirect("/allListing"); */
   let redirectUrl = res.locals.redirectUrl || "/allListing";
   res.redirect(redirectUrl);
  }
);

router.get("/", (req, res) => {
  res.render("./users/login.ejs");
});

module.exports = router;
