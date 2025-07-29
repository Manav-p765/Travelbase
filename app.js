const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const path = require("path");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressErrors = require("./utils/expressErrors.js");
const { listingSchema } = require("./schema.js");


app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsmate);

main()
    .then(() => {
        console.log("connection was successful");
    })
    .catch((err) => {
        console.log(err)
    });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Travelbase');
}

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressErrors(400, errmsg);
    }
    else {
        next();
    }
}

//index route
app.get("/listings", async (req, res, next) => {
    let allList = await listing.find({});
    res.render("listings/listing.ejs", { allList });
});

// new route
app.get("/listings/new", (req, res) => {
    res.render("listings/newList.ejs");
});

app.post("/listings/new", validateListing, wrapAsync(async (req, res, next) => {

    const newlisting = new listing(req.body.listing);
    let save = await newlisting.save();
    res.redirect("/listings");
}));

//single list route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let onelist = await listing.findById(id);
    res.render("listings/list.ejs", { onelist });
}));

//update route
app.get("/listings/:id/update", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let onelist = await listing.findById(id);
    res.render("listings/update.ejs", { onelist });
}));

app.put("/listings/:id/update", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
}));

//delete route 
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    await listing.findByIdAndDelete(req.params.id);
    res.redirect("/listings");
}));

// app.use( (req, res, next) => {
//     next(new ExpressErrors(404, "Page not found!"));
// });

// server side error validation
app.use((err, req, res, next) => {
    let { statusCode = 404, message = "page not found" } = err;
    console.log(err);
    res.status(statusCode).send(message);
});

app.listen("8080", () => {
    console.log("server is listening on port 8080");
});