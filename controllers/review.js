const Listing=require('../models/listing');
const Review=require('../models/review');

module.exports.createReview=async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("successMsg", "New Review Created");
    res.redirect(`/listings/${req.params.id}`);
}

module.exports.destoryReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    req.flash("successMsg", "Review Deleted");
    res.redirect(`/listings/${req.params.id}`);
    }