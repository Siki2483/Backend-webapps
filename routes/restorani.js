const express = require("express");
const auth = require("../middleware/auth");
const Restaurant = require("../models/Restaurants");
const { model } = require("mongoose");

const router = express.Router();


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
    const {name, type, mapLink, description, image } = req.body;

    try {

        let restaurant = new Restaurant({
            name, 
            type,
            mapLink, 
            description, 
            image,
            createdBy: req.user.id
        });

        await restaurant.save();
        res.json (restaurant);

    } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
    }
});

router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate("reviews.user", "name");
    res.json(restaurants);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



router.post("/:id/reviews", auth, async (req, res) => {
    const { text, rating } = req.body;
  
    if (!text || !rating) {
      return res.status(400).json({ msg: "Text and rating are required." });
    }
  
    try {
      const restaurant = await Restaurant.findById(req.params.id);
      if (!restaurant) {
        return res.status(404).json({ msg: "Restaurant not found" });
      }
  
      const alreadyReviewed = restaurant.reviews.find(
        (r) => r.user.toString() === req.user.id
      );
      if (alreadyReviewed) {
        return res.status(400).json({ msg: "You allready reviewd this restaurant." });
      }
  
      const newReview = {
        user: req.user.id,
        text,
        rating,
      };
  
      restaurant.reviews.push(newReview);
      await restaurant.save();
  
      res.json(restaurant.reviews);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

module.exports = router;