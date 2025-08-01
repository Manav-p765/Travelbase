const express = require("express");
const app = express();
const User = require("../models/user.js");
const passport = require("passport");
// const { reviewSchema } = require("../schema.js");
const router = express.Router({ mergeParams: true });


router.get("/signup", async (req, res) => {
    res.render("../views/users/signup.ejs");
});

router.post("/signup", async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });

        const registereduser = await User.register(newUser, password);

        req.flash("success", "welcome to Travelbase");
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
});

router.get("/login", (req, res) => {
    res.render("../views/users/login.ejs");
});

router.post("/login", passport.authenticate("local",
    {
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req, res) => {
        req.flash("success", "welcome back to travelbase!");
        res.redirect(redirectUrl);
    });
    


module.exports = router;  