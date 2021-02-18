const { thermalSchema, reviewSchema }  = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Thermal = require("./models/thermals");
const Review = require("./models/review");

const isLoggedIn = (req, res, next) => {
   if (!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in!");
    return res.redirect("/login")
    }; 
    next();
};
const validateThermal = (req, res, next) => {
    const { error } = thermalSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

const isAuthor = async(req, res,next) => {
    const { id } = req.params;
    const thermal = await Thermal.findById(id);
    if(!thermal.author.equals(req.user._id)){
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/thermals/${id}`);
    } 
    next();
};

const isReviewAuthor = async(req, res,next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/thermals/${id}`);
    } 
    next();
};

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

module.exports = {validateReview, validateThermal, isAuthor, isLoggedIn, isReviewAuthor}
// module.exports = isLoggedIn;
// module.exports = isAuthor;
// module.exports = validateThermal;
