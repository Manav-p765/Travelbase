const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router({mergeParams: true});
const { isLoggedIn, validateReview,isReviewauthor } = require("../middlewares.js");
const listingcontroller = require("../controllers/review.js")

//post route for review
router.post("/",  isLoggedIn,validateReview, wrapAsync(listingcontroller.postReview));

//delete route for review
router.delete("/:reviewId", isReviewauthor, isLoggedIn,wrapAsync(listingcontroller.destroyReview));

module.exports = router;