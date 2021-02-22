const Thermal = require("../models/thermals");
const {cloudinary} = require("../cloudinary")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const index = async (req, res) => {
    const thermals = await Thermal.find({});
    res.render("thermals/index", {thermals})
}
const renderNewForm = (req, res) => {
    res.render("thermals/new");
}
const createThermal = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.thermal.location,
        limit: 1,
    }).send()
    const thermal = new Thermal(req.body.thermal);
    thermal.geometry = geoData.body.features[0].geometry;
    thermal.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    thermal.author = req.user._id;
    await thermal.save();
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
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    thermal.images.push(...imgs);
    await thermal.save();
    if (req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await thermal.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash("success", "Succesfully Edited")
    res.redirect(`/thermals/${thermal._id}`)
}

const deleteThermal = async (req, res) => {
    const {id} =req.params;
    await Thermal.findByIdAndDelete(id);
    req.flash("success", "Successfuly Deleted the Thermal");
    res.redirect("/thermals");
}

module.exports = {
    index, 
    renderNewForm, 
    createThermal, 
    showThermal, 
    renderEditForm, 
    updateThermal, 
    deleteThermal
    }