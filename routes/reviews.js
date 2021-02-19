const express = require("express");
const router = express.Router({mergeParams: true});
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware")
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError");
const reviews = require("../controllers/reviews");
const Thermal = require("../models/thermals");
const Review = require("../models/review");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;