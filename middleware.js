const Listing=require('./models/listing');
const ExpressError = require('./utility func/ExpressError.js');
const ReviewSchema=require('./reviewSchema.js');
const Review=require('./models/review.js');
const ListingSchema = require('./schema.js');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        console.log(req.originalUrl);
        req.session.redirectUrl=req.originalUrl;
        req.flash("errorMsg","You must be logged in to create listings!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("errorMsg","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("errorMsg","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = ListingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((ele) => ele.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview=(req,res,next)=>{
    let {error}=ReviewSchema.validate(req.body.review);
    if(error){        
        let errMsg=error.details.map((ele)=> ele.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();

    }
};