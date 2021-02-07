const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const { thermalSchema } = require("./schemas.js");
const path = require('path');
const catchAsync = require("./utils/catchAsync")
const methodOverride = require("method-override");
const Thermal = require("./models/thermals");
const ExpressError = require("./utils/ExpressError");

mongoose.connect('mongodb://localhost:27017/thermalTr', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once("open", () => {
    console.log("database connected!!!");
});
const app = express();

app.engine("ejs", ejsMate);
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

const validateThermal = (req, res, next) => {
    const { error } = thermalSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
};

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/thermals', catchAsync(async (req, res) => {
    const thermals = await Thermal.find({});
    res.render("thermals/index", {thermals})
}));

app.get('/thermals/new', (req, res) => {
    res.render("thermals/new");
});

app.post('/thermals', validateThermal, catchAsync(async (req, res, next) => {
    //if(!req.body.thermal) throw new ExpressError("Invalid Thermal Data", 404);
    
    const thermal = new Thermal(req.body.thermal);
    await thermal.save();
    res.redirect(`/thermals/${thermal._id}`)
}));

app.get('/thermals/:id', catchAsync(async (req, res) => {
    const thermal= await Thermal.findById(req.params.id);
    res.render("thermals/show", { thermal});
}));

app.get("/thermals/:id/edit", catchAsync(async (req, res) => {
    const thermal = await Thermal.findById(req.params.id);
    res.render("thermals/edit", {thermal});
}));

app.put("/thermals/:id", validateThermal, catchAsync(async (req, res) => {
    const { id } = req.params;
    const thermal = await Thermal.findByIdAndUpdate(id, {...req.body.thermal});
    res.redirect(`/thermals/${thermal._id}`)
}));

app.delete("/thermals/:id", catchAsync(async (req, res) => {
    const {id} =req.params;
    await Thermal.findByIdAndDelete(id);
    res.redirect("/thermals");
}))

app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Oh no something Went worng"
    res.status(statusCode).render("error", { err });
} )

app.listen(3000, () => {
    console.log("Serving in port 3000")
});