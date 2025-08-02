const express = require("express");
const listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router({mergeParams: true});
const { isLoggedIn, validateReview,isReviewauthor } = require("../middlewares.js");



//post route for review
router.post("/",  isLoggedIn,validateReview, wrapAsync(async (req, res) => {
    let listings = await listing.findById(req.params.id);

    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;

    
    listings.review.push(newReview);

    await newReview.save();
    await listings.save();

    req.flash("success", "saved succesfully.");
    res.redirect(`/listings/${listings._id}`);
}));

//delete route for review
router.delete("/:reviewId", isReviewauthor, isLoggedIn,wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;

    await listing.findByIdAndUpdate( id , { $pull: { review: reviewId }});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "deleted succesfully.");
    res.redirect(`/listings/${id}`);
}));



module.exports = router;