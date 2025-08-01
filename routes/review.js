const express = require("express");
const app = express();
const listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErrors = require("../utils/expressErrors.js");
const { reviewSchema } = require("../schema.js");
const router = express.Router({mergeParams: true});
const { isLoggedIn } = require("../middlewares.js");

//validating reviews server side errors
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressErrors(400, errmsg);
    }
    else {
        next();
    }
};

//post route for review
router.post("/",  isLoggedIn,validateReview, wrapAsync(async (req, res) => {
    let listings = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    
    listings.review.push(newReview);

    await newReview.save();
    await listings.save();

    req.flash("success", "saved succesfully.");
    res.redirect(`/listings/${listings._id}`);
}));

//delete route for review
router.delete("/:reviewId",  isLoggedIn,wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;

    await listing.findByIdAndUpdate( id , { $pull: { review: reviewId }});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "deleted succesfully.");
    res.redirect(`/listings/${id}`);
}));



module.exports = router;