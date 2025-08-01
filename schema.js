const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        price: joi.number().required().min(0),
        country: joi.string().required(),
        image: joi.object({
            url: joi.string().allow("", null).optional(),
            filename: joi.string().allow("", null).optional()
        }).optional()
    }).required()
}).unknown(true);

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().default(1).min(1).max(5),
        comment: joi.string().required(),
    }).required()
})