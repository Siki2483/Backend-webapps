const express = require("express");
const auth = require("../middleware/auth");
const Nightlife = require("../models/Nightlife");

const router = express.Router();


router.post("/", auth, async (req, res) => {
  const { name, description, location, image } = req.body;
  try {
    const nightlife = new Nightlife({
      name,
      description,
      location,
      image,
      createdBy: req.user.id,
    });
    await nightlife.save();
    res.json(nightlife);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


router.get("/", async (req, res) => {
  try {
    const data = await Nightlife.find().populate("reviews.user", "name");
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const nightlife = await Nightlife.findById(req.params.id).populate("reviews.user", "name");
    if (!nightlife) return res.status(404).json({ msg: "Not found" });
    res.json(nightlife);
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
    const nightlife = await Nightlife.findById(req.params.id);
    if (!nightlife) return res.status(404).json({ msg: "Not found" });

    const alreadyReviewed = nightlife.reviews.find(r => r.user.toString() === req.user.id);
    if (alreadyReviewed) return res.status(400).json({ msg: "Already reviewed" });

    nightlife.reviews.push({ user: req.user.id, text, rating });
    await nightlife.save();
    res.json(nightlife.reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


router.put("/:id", auth, async (req, res) => {
  try {
    const nightlife = await Nightlife.findById(req.params.id);
    if (!nightlife) return res.status(404).json({ msg: "Not found" });
    if (nightlife.createdBy.toString() !== req.user.id) return res.status(401).json({ msg: "Not authorized" });

    nightlife.name = req.body.name || nightlife.name;
    nightlife.description = req.body.description || nightlife.description;
    nightlife.coordinates = req.body.coordinates || nightlife.coordinates;
    nightlife.mapsLink = req.body.mapsLink || nightlife.mapsLink;

    await nightlife.save();
    res.json(nightlife);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


router.delete("/:id", auth, async (req, res) => {
  try {
    const nightlife = await Nightlife.findById(req.params.id);
    if (!nightlife) return res.status(404).json({ msg: "Not found" });
    if (nightlife.createdBy.toString() !== req.user.id) return res.status(401).json({ msg: "Not authorized" });

    await nightlife.deleteOne();
    res.json({ msg: "Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;