const listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.postReview = async (req, res) => {
    let listings = await listing.findById(req.params.id);

    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;

    
    listings.review.push(newReview);

    await newReview.save();
    await listings.save();

    req.flash("success", "saved succesfully.");
    res.redirect(`/listings/${listings._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let {id, reviewId} = req.params;

    await listing.findByIdAndUpdate( id , { $pull: { review: reviewId }});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "deleted succesfully.");
    res.redirect(`/listings/${id}`);
};