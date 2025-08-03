const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");


const listingSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    filename: String,
    url: {
      type: String,
      required: true,
    }
  },
  price: {
    type: Number,
    required: true
  },
  location: String,
  country: String,
  review: [
    {
      type: schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  owner: {
    type: schema.Types.ObjectId,
    ref: "User",
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.review } });
  }
});

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;