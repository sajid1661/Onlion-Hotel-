const express = require('express');
const router = express.Router();
const errorHandler = require('../utility func/ErrorHandler.js');
const Listing = require("../models/listing.js");
const Review=require('../models/review.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingController=require('../controllers/listings.js');

//create Index Route
//errorHandler means wrapAsync
router.get("/", errorHandler(listingController.index));
//Create New Listing Route
router.get("/new", isLoggedIn, listingController.renderNewForm);
//data storing in DB
router.post("/", validateListing, errorHandler(listingController.createListing));
//show route for individual listing
router.get("/:id", errorHandler(listingController.showListing));
// Update route and update listing
router.get("/:id/edit", isLoggedIn, isOwner, errorHandler(listingController.renderEditForm));
router.put("/:id", validateListing, errorHandler(listingController.updateListing));
//Delete route for Delete listing
router.delete("/:id", isLoggedIn, isOwner, errorHandler(listingController.destoryListing));

module.exports = router;