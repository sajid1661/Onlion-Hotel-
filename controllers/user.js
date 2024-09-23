const User=require('../models/user');

module.exports.renderSignupForm=(req, res) => {
    res.render("./users/signup.ejs");
}

module.exports.signup=async (req, res) => {
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
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }else{
            req.flash("successMsg","You are logged out!");
            res.redirect("/listings");
        }
    })
}

module.exports.renderLoginForm=(req, res) => {
    res.render("./users/login.ejs")
}

module.exports.login=(req, res) => {
    req.flash("successMsg","Welcom to Wanderlust ");
    var redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}