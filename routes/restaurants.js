const express = require("express");
const auth = require("../middleware/auth");
const Restaurant = require("../models/Restaurant");
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
  const { name, type, mapLink, description, image, location } = req.body;

  if (!location || !location.coordinates || location.coordinates.length !== 2) {
    return res.status(400).json({ msg: "Invalid or missing coordinates." });
  }

  try {
    let restaurant = new Restaurant({
      name,
      type,
      mapLink,
      description,
      image,
      location,
      createdBy: req.user.id
    });

    await restaurant.save();
    res.json(restaurant);
  } catch (err) {
    console.error("POST /restaurants error:", err.message);
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

router.get("/:id", async (req, res) => {
  try {
    const restaurants = await Restaurant.findById(req.params.id).populate("reviews.user", "name");
    if (!restaurants) return res.status(404).json({ msg: "Not found" });
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

  router.get("/nearby", async (req, res) => {
    const { lat, lng } = req.query;
  
    if (!lat || !lng) {
      return res.status(400).json({ msg: "Latitude and longitude are required" });
    }
  
    try {
      const locations = await Restaurant.find({
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            $maxDistance: 5000,
          },
        },
      });
  
      res.json(locations);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

  module.exports = router;