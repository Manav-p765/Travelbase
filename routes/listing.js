const express = require("express");
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErrors = require("../utils/expressErrors.js");
const { listingSchema } = require("../schema.js");
const { authenticate } = require("passport");
const router = express.Router();
const {isLoggedIn} = require("../middlewares.js");



//validating lisiting server side errors
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressErrors(400, errmsg);
    }
    else {
        next();
    }
};


//index route
router.get("/", validateListing, async (req, res, next) => {
let allList = await listing.find({});
    res.render("listings/listing.ejs", { allList });
});

// new post route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/newList.ejs");
});

router.post("/new", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {

    const newlisting = new listing(req.body.listing);
    let save = await newlisting.save();
    req.flash("success", "saved succesfully.");
    res.redirect("/listings");
}));

//single list route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let onelist = await listing.findById(id).populate("review");
    if (onelist === null) {
        req.flash("error", "This does not exist.");
        res.redirect("/listings");
    } else {
        res.render("listings/list.ejs", { onelist });
    }
}));

//update route
router.get("/:id/update", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let onelist = await listing.findById(id);
    if (onelist === null) {
        req.flash("error", "This does not exist.");
        res.redirect("/listings");
    } else {
        res.render("listings/update.ejs", { onelist });
    }
    
}));

router.put("/:id/update", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "updated succesfully.");
    res.redirect(`/listings/${id}`);
}));

//delete route 
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    await listing.findByIdAndDelete(req.params.id);
        req.flash("success", "deleted succesfully.");
    res.redirect("/listings");
}));



module.exports = router;