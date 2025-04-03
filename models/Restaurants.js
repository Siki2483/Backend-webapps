const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({

    name: {type: String, required: true},
    type : {type: String},
    description: {type: String},
    rating: {type: Number, default: 0},
    mapLink: {type: String},
    image: {type: String, required: false},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviews: [
        {
            user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
            text: {type: String, required: true},
            rating: {type: Number, min: 1, max: 5, required: true},
            createdAt: {type: Date, default: Date.now},
        },
    ],
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);