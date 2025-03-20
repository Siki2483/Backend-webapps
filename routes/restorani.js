const express = require("express");
const auth = require("../middleware/auth");
const Restaurant = require("../models/Restaurants");
const { model } = require("mongoose");

const router = express.Router();

// (ADMIN)

const admin = require("../middleware/admin");

router.delete("/:id", auth, admin, async (req, res) => {
    try {
        await Restaurant.findByIdAndDelete(req.params.id);
        res.json({msg: "Restaurant deleted"});
    } catch (err) {
        res.status(500).send("Server error");
    }
});


router.post("/", auth, async (req, res) => {
    const {name, location, description } = req.body;

    try {

        let restaurant = new Restaurant({name, location, description});
        await restaurant.save();
        res.json (restaurant);

    } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
    }
});

router.get ("/", async (req, res) => {

    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// Recenzije

router.post("/:id/rewievs", auth, async(req, res) => {
    try {
        const restaurants = await Restaurants.findById(req.params.id);
        if (!restaurants) {
            return res.status(404).json({msg: "Restaurant not found"});
        }

        const newRewiev = {
            user: req.user.id,
            text: req.body.text,
            raiting: req.body.raiting,
        };

        restaurant.reviews.push(newRewiev);
        await restaurant.save();
        res.json(restaurant);
    } catch (err) {
        console.error(err.message);
        res.status(505).send("Server error");
    }

});

module.exports = router;