if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utility func/ExpressError.js');
const listingRouter=require('./routes/listing.js');
const reviewRouter=require('./routes/review.js');
const userRouter=require('./routes/user.js');
const User=require('./models/user.js');
const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(flash());
app.engine('ejs', ejsMate);

app.listen(8080, () => {
    console.log("Server is listening on port num: 8080");
})

// local host database link
// let MongoURL = "mongodb://127.0.0.1:27017/wanderlust";
// Mondodb/cloud link;
let dbURL=process.env.ATLASDB_URL;
async function main() {
    await mongoose.connect(dbURL);
}
main().then(() => {
    console.log("DataBase connected");
}).catch((err) => {
    console.log(err);
})

const store=MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24*3600
});
store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE", error);
});
let sessionOptions={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

// root route
// app.get("/", (req, res) => {
//     res.send("this is root route");
// })

app.use(session(sessionOptions));
//Passport Baisc settings
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("successMsg");
    res.locals.errorMsg=req.flash("errorMsg");
    res.locals.currUser=req.user;
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email: "majid@gmail.com",
//         username: "Majid786"
//     });
    
//     let registeredUser= await User.register(fakeUser,"Malik1661");
//     res.send(registeredUser);
// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



//Wrong path page
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})
//Custom error handler middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrongs" } = err;
    console.log(err); 
    res.status(status).render("error.ejs", { message });
})

