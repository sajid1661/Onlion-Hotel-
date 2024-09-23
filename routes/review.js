const express=require('express');
const router=express.Router({mergeParams: true});
const errorHandler = require('../utility func/ErrorHandler.js');
const ExpressError = require('../utility func/ExpressError.js');
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');

//add new review or //post review
router.post("/",isLoggedIn ,validateReview, errorHandler(async(req,res)=>{

    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("successMsg", "New Review Created");
    res.redirect(`/listings/${req.params.id}`);
}))
//Delte review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, errorHandler(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    req.flash("successMsg", "Review Deleted");
    res.redirect(`/listings/${req.params.id}`);
    }))

module.exports=router;