const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middlewares.js");
const listingcontroller = require("../controllers/listing.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//index route
router.get("/", validateListing, listingcontroller.index);

// new post route
router.get("/new", isLoggedIn, listingcontroller.newlist);

router.post("/new", isLoggedIn,upload.single("listing[image]"), validateListing, wrapAsync(listingcontroller.createNewList));

//single list route
router.get("/:id", wrapAsync(listingcontroller.singleListInfo));

//update route
router.get("/:id/update", isOwner, isLoggedIn, wrapAsync(listingcontroller.updateList));

router.put("/:id/update", isOwner, isLoggedIn,upload.single("listing[image]"), validateListing, wrapAsync(listingcontroller.updateListPost));

//delete route 
router.delete("/:id", isOwner, isLoggedIn, wrapAsync(listingcontroller.destroyList));

module.exports = router;