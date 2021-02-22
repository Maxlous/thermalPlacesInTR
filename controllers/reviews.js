const Thermal = require("../models/thermals");
const Review = require("../models/review");

const createReview = async(req, res) => {
    const thermal = await Thermal.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    thermal.reviews.push(review);
    await review.save();
    await thermal.save();
    req.flash("success", "Created New Review");
    res.redirect(`/thermals/${thermal._id}`);
}

const deleteReview = async(req, res) => {
    const { id, reviewId } = req.params;
    await Thermal.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review has been deleted");
    res.redirect(`/thermals/${id}`);
}
module.exports = {createReview, deleteReview}