const mongoose = require("mongoose");

const NightlifeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["Nightclub", "Beachbar", "Caffebar"],
    required: true,
  },
  description: { type: String },
  mapLink: { type: String },
  image: { type: String },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },

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

NightlifeSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Nightlife", NightlifeSchema);
