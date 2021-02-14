const express = require("express");
const router = express.Router({mergeParams: true});

const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schemas.js");


const Thermal = require("../models/thermals");
const Review = require("../models/review");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.post("/", validateReview, catchAsync(async(req, res) => {
    const thermal = await Thermal.findById(req.params.id);
    const review = new Review(req.body.review);
    thermal.reviews.push(review);
    await review.save();
    await thermal.save();
    req.flash("success", "Created New Review");
    res.redirect(`/thermals/${thermal._id}`);
}))

router.delete("/:reviewId", catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    await Thermal.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfuly Deleted the Review");
    res.redirect(`/thermals/${id}`);
}))

module.exports = router;