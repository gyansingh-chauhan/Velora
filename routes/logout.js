const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");


router.get("/", (req, res) => {
  
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "You have logged out successfully");
      res.redirect("/allListing");
    })}
);

module.exports = router;
