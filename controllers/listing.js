const listing = require("../models/listing.js");

module.exports.index = async (req, res, next) => {
    let allList = await listing.find({});
    res.render("listings/listing.ejs", { allList });
};

module.exports.newlist = (req, res) => {
    res.render("listings/newList.ejs");
};

module.exports.createNewList = async (req, res, next) => {
const images = req.files.map(file => ({
  url: file.path,
  filename: file.filename
}));

    const newlisting = new listing(req.body.listing);
    newlisting.owner = req.user._id;

    newlisting.image = images;

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
        const resizedImageUrls = onelist.image.map(img => {
        return img.url.replace("/upload", "/upload/w_250");
    });
        res.render("listings/update.ejs", { onelist, resizedImageUrls });
    }
};

module.exports.updateListPost = async (req, res) => {
  const { id } = req.params;

  // Update other listing fields
  const newlisting = await listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

  if (req.files && req.files.length > 0) {
    const newImages = req.files.map(file => ({
      url: file.path,
      filename: file.filename
    }));

    // Push new images to existing ones
    newlisting.image.push(...newImages);
    await newlisting.save();
  }

  req.flash("success", "Updated successfully.");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyList = async (req, res) => {
    await listing.findByIdAndDelete(req.params.id);
    req.flash("success", "deleted succesfully.");
    res.redirect("/listings");
};