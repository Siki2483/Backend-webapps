const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({

    name: {type: String, required: true},
    location: {type: String, required: true},
    description: {type: String},
    raiting: {type: Number, default: 0},
    reviews: [
        {
            user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
            text: String,
            raiting: Number,
            date: {type: Date, default: Date.now},
        },
    ],
});

module.exports = mongoose.model("Restaurant, Restaurant.Schema");