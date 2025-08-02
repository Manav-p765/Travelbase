const express = require("express");
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const {isLoggedIn, isOwner, validateListing} = require("../middlewares.js");

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
    newlisting.owner = req.user._id;

    let save = await newlisting.save();
    req.flash("success", "saved succesfully.");
    res.redirect("/listings");
}));

//single list route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let onelist = await listing.findById(id).populate({ path: "review", populate: { path: "author"},}).populate("owner");
    if (onelist === null) {
        req.flash("error", "This does not exist.");
        res.redirect("/listings");
    } else {
        res.render("listings/list.ejs", { onelist });
    }
}));

//update route
router.get("/:id/update", isOwner, isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let onelist = await listing.findById(id);
    if (onelist === null) {
        req.flash("error", "This does not exist.");
        res.redirect("/listings");
    } else {
        res.render("listings/update.ejs", { onelist });
    }
    
}));

router.put("/:id/update", isOwner, isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "updated succesfully.");
    res.redirect(`/listings/${id}`);
}));

//delete route 
router.delete("/:id", isOwner, isLoggedIn, wrapAsync(async (req, res) => {
    await listing.findByIdAndDelete(req.params.id);
        req.flash("success", "deleted succesfully.");
    res.redirect("/listings");
}));



module.exports = router;