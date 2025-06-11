const express = require("express");
const auth = require("../middleware/auth");
const Location = require("../models/Locations");


const router = express.Router();



router.post("/", auth, async (req, res) => {
  const { name, type, description, image, mapLink, location } = req.body;

  if (!location || !location.coordinates || location.coordinates.length !== 2) {
    return res.status(400).json({ msg: "Invalid coordinates." });
  }

  try {
    const locationEntry = new Location({
      name,
      type,
      description,
      image,
      mapLink,
      location,
      createdBy: req.user.id,
    });

    await locationEntry.save();
    res.json(locationEntry);
  } catch (err) {
    console.error("POST /locations error:", err.message);
    res.status(500).send("Server error");
  }
});




router.get("/", async (req, res) => {
  try {
    const locations = await Location.find().populate("reviews.user","name");
    res.json(locations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const locations = await Location.findById(req.params.id).populate("reviews.user", "name");
    if (!locations) return res.status(404).json({ msg: "Not found" });
    res.json(locations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    let location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ msg: "Not found" });

    if (location.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    location.name = req.body.name || location.name;
    location.description = req.body.description || location.description;
    location.coordinates = req.body.coordinates || location.coordinates;
    location.type = req.body.type || location.type;

    await location.save();
    res.json(location);
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
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ msg: "Location not found" });
    }

    const alreadyReviewed = location.reviews.find(
      (r) => r.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({msg: "You have allready reviewed this location"});
    }

    const newReview = {
      user: req.user.id,
      text,
      rating,
    };

    location.reviews.push(newReview);
    await location.save();

    res.json(location.reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


router.delete("/:id", auth, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ msg: "Not found" });

    if (location.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await location.deleteOne();
    res.json({ msg: "Deleted" });
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
    const locations = await Location.find({
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
