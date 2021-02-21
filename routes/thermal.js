const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Thermal = require("../models/thermals");
const {isLoggedIn, isAuthor, validateThermal } = require("../middleware");
const thermals = require("../controllers/thermals");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({storage});
router.route("/")
    .get(catchAsync(thermals.index))
    .post(isLoggedIn, upload.array("image"), validateThermal, catchAsync(thermals.createThermal))
    
router.get('/new', isLoggedIn, thermals.renderNewForm);

router.route("/:id")
    .get(catchAsync(thermals.showThermal))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateThermal, catchAsync(thermals.updateThermal))
    .delete(isLoggedIn, isAuthor, catchAsync(thermals.deleteThermal))
    
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(thermals.renderEditForm));

module.exports = router;