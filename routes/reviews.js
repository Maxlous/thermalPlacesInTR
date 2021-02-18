const express = require("express");
const router = express.Router({mergeParams: true});
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware")
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError");

const Thermal = require("../models/thermals");
const Review = require("../models/review");

router.post("/", isLoggedIn, validateReview, catchAsync(async(req, res) => {
    const thermal = await Thermal.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    thermal.reviews.push(review);
    await review.save();
    await thermal.save();
    req.flash("success", "Created New Review");
    res.redirect(`/thermals/${thermal._id}`);
}))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    await Thermal.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfuly Deleted the Review");
    res.redirect(`/thermals/${id}`);
}))

module.exports = router;