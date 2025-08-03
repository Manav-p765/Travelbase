const listing = require("../models/listing.js");

module.exports.index = async (req, res, next) => {
    let allList = await listing.find({});
    res.render("listings/listing.ejs", { allList });
};

module.exports.newlist = (req, res) => {
    res.render("listings/newList.ejs");
};

module.exports.createNewList = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newlisting = new listing(req.body.listing);
    newlisting.owner = req.user._id;

    newlisting.image = { url, filename };

    let save = await newlisting.save();
    req.flash("success", "saved succesfully.");
    res.redirect("/listings");
};

module.exports.singleListInfo = async (req, res) => {
    let { id } = req.params;
    let onelist = await listing.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate({path: "owner"});
    if (onelist === null) {
        req.flash("error", "This does not exist.");
        res.redirect("/listings");
    } else {
        res.render("listings/list.ejs", { onelist });
    }
};

module.exports.updateList = async (req, res) => {
    let { id } = req.params;
    let onelist = await listing.findById(id);
    if (onelist === null) {
        req.flash("error", "This does not exist.");
        res.redirect("/listings");
    } else {
        let oldImageUrl = onelist.image.url;
        oldImageUrl = oldImageUrl.replace("/upload", "/upload/w_250");
        res.render("listings/update.ejs", { onelist, oldImageUrl });
    }
};

module.exports.updateListPost = async (req, res) => {
    let { id } = req.params;
    let newlisting = await listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        newlisting.image = { url, filename };
        await newlisting.save();
    }
    req.flash("success", "updated succesfully.");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyList = async (req, res) => {
    await listing.findByIdAndDelete(req.params.id);
    req.flash("success", "deleted succesfully.");
    res.redirect("/listings");
};