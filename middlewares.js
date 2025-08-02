const listing = require("./models/listing.js");
const review = require("./models/review.js");
const ExpressErrors = require("./utils/expressErrors.js");
const { listingSchema, reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must login first");
        return  res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let onelist = await listing.findById(id);
    if(!onelist.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the owner");
        return res.redirect(`/listings/${id}`);
    }

    next();

};


//validating lisiting server side errors
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressErrors(400, errmsg);
    }
    else {
        next();
    }
};

//validating reviews server side errors
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressErrors(400, errmsg);
    }
    else {
        next();
    }
};

module.exports.isReviewauthor = async(req, res, next) => {
    let { id, reviewId } = req.params;

    let onelist = await review.findById(reviewId);
    if(!onelist.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the author of review");
        return res.redirect(`/listings/${id}`);
    }

    next();

};