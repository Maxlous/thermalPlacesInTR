const express = require("express");
const router = express.Router();
const { thermalSchema } = require("../schemas.js");
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError");
const Thermal = require("../models/thermals");
const isLoggedIn = require("../middleware");

const validateThermal = (req, res, next) => {
    const { error } = thermalSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
};
router.get('/', catchAsync(async (req, res) => {
    const thermals = await Thermal.find({});
    res.render("thermals/index", {thermals})
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render("thermals/new");
});

router.post('/', isLoggedIn, validateThermal, catchAsync(async (req, res, next) => {
    //if(!req.body.thermal) throw new ExpressError("Invalid Thermal Data", 404);
    const thermal = new Thermal(req.body.thermal);
    await thermal.save();
    req.flash("success", "Making thermal: Success!");
    res.redirect(`/thermals/${thermal._id}`)
}));

router.get('/:id', catchAsync(async (req, res) => {
    const thermal= await Thermal.findById(req.params.id).populate("reviews");
    if(!thermal){
        req.flash("error", "Cannot find the Thermal!");
        return res.redirect("/thermals")
    }
    res.render("thermals/show", { thermal });
}));

router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res) => {
    const thermal = await Thermal.findById(req.params.id);
    if(!thermal){
        req.flash("error", "Cannot find the Thermal!");
        return res.redirect("/thermals")
    }
    res.render("thermals/edit", {thermal});
}));

router.put("/:id", isLoggedIn, validateThermal, catchAsync(async (req, res) => {
    const { id } = req.params;
    const thermal = await Thermal.findByIdAndUpdate(id, {...req.body.thermal});
    req.flash("success", "Succesfully Edited")
    res.redirect(`/thermals/${thermal._id}`)
}));

router.delete("/:id", isLoggedIn, catchAsync(async (req, res) => {
    const {id} =req.params;
    await Thermal.findByIdAndDelete(id);
    req.flash("success", "Successfuly Deleted the Thermal");
    res.redirect("/thermals");
}))

module.exports = router;