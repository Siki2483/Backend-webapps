const mongoose = require("mongoose");

const NightlifeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {type: String, enum: ["nightclub", "beachbar", "caffebar"], required: true},
  description: { type: String },
  mapLink: { type: String },
  image: {type: String},
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: { type: String, required: true },
      rating: { type: Number, min: 1, max: 5, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Nightlife", NightlifeSchema);