if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

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
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const { request } = require("http");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listing = require("./models/listing.js");

const dbUrl = process.env.ATLASURL;

//mongoose connection setup
main()
    .then(() => {
        console.log("connection was successful");
    })
    .catch((err) => {
        console.log(err)
    });

async function main() {
    await mongoose.connect(dbUrl);
};

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsmate);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", ()=>{
    console.log("error in mongo session");
});

//sessions for cookies
const sessionOptain = {
    store,
    secret: process.env.SECRET,
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
    res.locals.currUser = req.user || null;
    next();
});


app.get("/", (req, res) => {
    res.redirect("/listings"); // or render a landing page
});

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