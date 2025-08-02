const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const path = require("path");
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js")
const session = require('express-session');
const flash = require("connect-flash");
const { request } = require("http");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


//mongoose connection setup
main()
    .then(() => {
        console.log("connection was successful");
    })
    .catch((err) => {
        console.log(err)
    });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Travelbase');
};

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsmate);

//sessions for cookies
const sessionOptain = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptain));
app.use(flash());

// for password and authorization
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

//router for all listing route
app.use("/listings", listingRoute);

//router for all review request/route
app.use("/listings/:id/reviews", reviewRoute);

//router for all user route
app.use("/", userRoute);

// server side error validation
app.use((err, req, res, next) => {
    let { statusCode = 404, message = "page not found" } = err;
    console.log(err);
    res.status(statusCode).render("listings/error.ejs", { statusCode, message });
});

//listening route
app.listen("8080", () => {
    console.log("server is listening on port 8080");
});