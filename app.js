const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const path = require('path');
const methodOverride = require("method-override");
const Thermal = require("./models/thermals");

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

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/thermals', async (req, res) => {
    const thermals = await Thermal.find({});
    res.render("thermals/index", {thermals})
});

app.get('/thermals/new', (req, res) => {
    res.render("thermals/new");
});

app.post('/thermals', async (req, res) => {
    const thermal = new Thermal(req.body.thermal);
    await thermal.save();
    res.redirect(`/thermals/${thermal._id}`)
});

app.get('/thermals/:id', async (req, res) => {
    const thermal= await Thermal.findById(req.params.id);
    res.render("thermals/show", { thermal});
});

app.get("/thermals/:id/edit", async (req, res) => {
    const thermal = await Thermal.findById(req.params.id);
    res.render("thermals/edit", {thermal});
});

app.put("/thermals/:id", async (req, res) => {
    const { id } = req.params;
    const thermal = await Thermal.findByIdAndUpdate(id, {...req.body.thermal});
    res.redirect(`/thermals/${thermal._id}`)

});

app.delete("/thermals/:id", async (req, res) => {
    const {id} =req.params;
    await Thermal.findByIdAndDelete(id);
    res.redirect("/thermals");
})

app.listen(3000, () => {
    console.log("Serving in port 3000")
});