const { link } = require("fs");
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const imageSchema = new mongoose.Schema({
  filename: String,
  url: {
    type: String,
    default: "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=1267&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    set: (v) =>
      v === "" ? "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=1267&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
  }
});


const listingSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: imageSchema,
  price: Number,
  location: String,
  country: String,
});

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;