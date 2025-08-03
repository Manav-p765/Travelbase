const express = require("express");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");
const router = express.Router({ mergeParams: true });
const listingcontroller = require("../controllers/user.js");


router.get("/signup", listingcontroller.userSignup);

router.post("/signup", listingcontroller.userSignPost);

router.get("/login", listingcontroller.userLogin);

router.post("/login", saveRedirectUrl,
    passport.authenticate("local",
        {
            failureRedirect: "/login",
            failureFlash: true
        }),
    listingcontroller.userLoginPost);

router.post("/logout", listingcontroller.userLogout);


module.exports = router;  