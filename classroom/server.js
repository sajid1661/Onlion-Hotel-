const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true
}
app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/register", (req, res) => {
    let { name = "unknown" } = req.query;
    req.session.name = name;
    if (name === "unknown") {
        req.flash("error", "User not register!");
    }
    else {
        req.flash("success", "User register successful!");
    }
    res.redirect("/member");
})

app.get("/member", (req, res) => {
    res.render("page.ejs", { name: req.session.name });
})
app.listen(3000, () => {
    console.log('server is listening port number 3000');
})

