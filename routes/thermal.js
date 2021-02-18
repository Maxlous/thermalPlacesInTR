const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Thermal = require("../models/thermals");
const {isLoggedIn, isAuthor, validateThermal } = require("../middleware");

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
    thermal.author = req.user._id;
    await thermal.save();
    req.flash("success", "Making thermal: Success!");
    res.redirect(`/thermals/${thermal._id}`)
}));

router.get('/:id', catchAsync(async (req, res) => {
    const thermal= await Thermal.findById(req.params.id).populate({
        path:"reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if(!thermal){
        req.flash("error", "Cannot find the Thermal!");
        return res.redirect("/thermals")
    }
    res.render("thermals/show", { thermal });
}));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} =req.params;
    const thermal = await Thermal.findById(id);
    if(!thermal){
        req.flash("error", "Cannot find the Thermal!");
        return res.redirect("/thermals")
    }
    res.render("thermals/edit", {thermal});
}));

router.put("/:id", isLoggedIn, isAuthor, validateThermal, catchAsync(async (req, res) => {
    const { id } = req.params;
    const thermal = await Thermal.findByIdAndUpdate(id, {...req.body.thermal});
    req.flash("success", "Succesfully Edited")
    res.redirect(`/thermals/${thermal._id}`)
}));

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} =req.params;
    await Thermal.findByIdAndDelete(id);
    req.flash("success", "Successfuly Deleted the Thermal");
    res.redirect("/thermals");
}))

module.exports = router;