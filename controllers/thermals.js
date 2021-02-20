const Thermal = require("../models/thermals");


const index = async (req, res) => {
    const thermals = await Thermal.find({});
    res.render("thermals/index", {thermals})
}
const renderNewForm = (req, res) => {
    res.render("thermals/new");
}
const createThermal = async (req, res, next) => {
    //if(!req.body.thermal) throw new ExpressError("Invalid Thermal Data", 404);
    const thermal = new Thermal(req.body.thermal);
    thermal.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    thermal.author = req.user._id;
    await thermal.save();
    console.log(thermal);
    req.flash("success", "Making thermal: Success!");
    res.redirect(`/thermals/${thermal._id}`)
}

const showThermal = async (req, res) => {
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
}

const renderEditForm = async (req, res) => {
    const {id} =req.params;
    const thermal = await Thermal.findById(id);
    if(!thermal){
        req.flash("error", "Cannot find the Thermal!");
        return res.redirect("/thermals")
    }
    res.render("thermals/edit", {thermal});
}
const updateThermal = async (req, res) => {
    const { id } = req.params;
    const thermal = await Thermal.findByIdAndUpdate(id, {...req.body.thermal});
    req.flash("success", "Succesfully Edited")
    res.redirect(`/thermals/${thermal._id}`)
}

const deleteThermal = async (req, res) => {
    const {id} =req.params;
    await Thermal.findByIdAndDelete(id);
    req.flash("success", "Successfuly Deleted the Thermal");
    res.redirect("/thermals");
}

module.exports = {index, renderNewForm, createThermal, showThermal, renderEditForm, updateThermal, deleteThermal }