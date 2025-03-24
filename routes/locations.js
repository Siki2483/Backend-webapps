const express = require("express");
const auth = require("../middleware/auth");
const Location = require("../models/Locations");

const router = express.Router();

// dodavanje

router.post("/", auth, async (req, res) => {
  const { name, type, description, coordinates, mapsLink } = req.body;

  try {
    const location = new Location({
      name,
      type, 
      description,
      coordinates,
      mapsLink,
      createdBy: req.user.id,
    });

    await location.save();
    res.json(location);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// dohvacivanje

router.get("/", async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// azuriranje

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

// recnzija
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


// za brisanje

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

module.exports = router;
