const express = require("express");
const router = express.Router();

const Location = require("../models/Locations");
const Restaurant = require("../models/Restaurant");
const Nightlife = require("../models/Nightlife");

router.get("/nearby", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ msg: "Latitude and longitude are required" });
  }

  const userLocation = [parseFloat(lng), parseFloat(lat)];
  const maxDistance = 5000;

  try {
    const [locations, restaurants, nightlife] = await Promise.all([
      Location.find({
        location: {
          $nearSphere: {
            $geometry: { type: "Point", coordinates: userLocation },
            $maxDistance: maxDistance,
          },
        },
      }),
      Restaurant.find({
        location: {
          $nearSphere: {
            $geometry: { type: "Point", coordinates: userLocation },
            $maxDistance: maxDistance,
          },
        },
      }),
      Nightlife.find({
        location: {
          $nearSphere: {
            $geometry: { type: "Point", coordinates: userLocation },
            $maxDistance: maxDistance,
          },
        },
      }),
    ]);

    res.json({
      locations,
      restaurants,
      nightlife,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
