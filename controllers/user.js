const User = require("../models/user.js");

module.exports.userSignup = async (req, res) => {
    res.render("../views/users/signup.ejs");
};

module.exports.userSignPost = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });

        const registereduser = await User.register(newUser, password);

        req.logIn(registereduser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "welcome to Travelbase");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.userLogin = (req, res) => {
    res.render("../views/users/login.ejs");
};

module.exports.userLoginPost = (req, res) => {
    req.flash("success", "welcome back to travelbase!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.userLogout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logout successfull");
        res.redirect("/listings");
    });
};

