const joi = require('joi');

module.exports.naturewalkSchema = joi.object({
        naturewalk:joi.object({
            title : joi.string().required(),
            price : joi.number().required().min(0),
            location : joi.string().required(),
            image : joi.string().required(),
            description : joi.string().required(),
        }).required()
    });

module.exports.reviewSchema = joi.object({
        review:joi.object({
            review : joi.string().required(),
            rating : joi.number().required(),
        }).required()
    });

