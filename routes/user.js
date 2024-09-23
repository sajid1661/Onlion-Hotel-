const express = require('express');
const User = require('../models/user');
const router = express.Router();
const ErrorHandler = require("../utility func/ErrorHandler");
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');

router.get("/signup", (req, res) => {
    res.render("./users/signup.ejs");
})

router.post("/signup", ErrorHandler(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("successMsg","Welcom to Wanderlust!")
            res.redirect('/listings');
        })}catch (e) {
        req.flash("errorMsg", e.message);
        res.redirect('/signup');
    }
}))

router.get("/login", (req, res) => {
    res.render("./users/login.ejs")
})

router.post("/login", saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true, }), (req, res) => {
    req.flash("successMsg","Welcom to Wanderlust ");
    var redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
})

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }else{
            req.flash("successMsg","You are logged out!");
            res.redirect("/listings");
        }
    })
})

module.exports = router;