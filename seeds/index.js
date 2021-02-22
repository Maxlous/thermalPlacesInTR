const mongoose = require('mongoose');
const Thermal = require("../models/thermals");
const { places, descriptors} = require('./seedHelpers');
const cities = require("./cities");
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
const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Thermal.deleteMany({});
    for (let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() *1000);
        const price = Math.floor(Math.random() *30 +5);
        const place = new Thermal({
            author: "602e857c41309c678cfa1dbf",
            location : `${cities[random1000].city}, ${cities[random1000].state} `,
            title : `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type:"Point",
                coordinates: [-113.1331, 47.0202]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/maxlous/image/upload/v1613840667/ThermalPlaces/mthn6vzun1tq84jez9ug.jpg',
                  filename: 'ThermalPlaces/mthn6vzun1tq84jez9ug'
                },
                {
                  url: 'https://res.cloudinary.com/maxlous/image/upload/v1613840669/ThermalPlaces/qgrztlkwwdn8ko92pkt0.jpg',
                  filename: 'ThermalPlaces/qgrztlkwwdn8ko92pkt0'
                }
              ],            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias perferendis magni quam deleniti odio delectus adipisci ut aut nesciunt vel. Rerum esse reprehenderit ratione reiciendis voluptatem placeat delectus quod in?",
            price
        })
        await place.save();
    }
    
};
seedDB().then(() => {
    mongoose.connection.close();
})