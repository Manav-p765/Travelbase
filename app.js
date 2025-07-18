const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const path = require("path");

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

//index route
app.get("/listings", async (req, res) => {
    let allList = await listing.find({});
    res.render("listings/listing.ejs", { allList });
});

// new route
app.get("/listings/new", (req, res) => {
    res.render("listings/newList.ejs");
});

app.put("/listings/new", async (req, res) => {
    const newlisting = new listing(req.body.listing);
    let save = await newlisting.save();
    console.log(save);
    res.redirect("/listings");
});

//single list route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let onelist = await listing.findById(id);
    res.render("listings/list.ejs", { onelist });
});

//update route
app.get("/listings/:id/update", async (req, res) => {
    let { id } = req.params;
    let onelist = await listing.findById(id);
    res.render("listings/update.ejs", { onelist });
});

app.put("/listings/:id/update", async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
});

//delete route 
app.delete("/listings/:id", async (req, res) => {
    await listing.findByIdAndDelete(req.params.id);
    res.redirect("/listings");
});

app.listen("8080", () => {
    console.log("server is listening on port 8080");
});