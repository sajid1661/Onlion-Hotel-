const express=require('express');
const router=express.Router({mergeParams: true});
const errorHandler = require('../utility func/ErrorHandler.js');
const ExpressError = require('../utility func/ExpressError.js');
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');
const reviewController=require('../controllers/review.js');

//add new review or //post review
router.post("/",isLoggedIn ,validateReview, errorHandler(reviewController.createReview));
//Delte review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, errorHandler(reviewController.destoryReview));

module.exports=router;