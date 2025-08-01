const { string } = require("joi");
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const reviewSchema = new schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 1,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    author: {
        type: schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Review", reviewSchema);
