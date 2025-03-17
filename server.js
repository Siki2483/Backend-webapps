require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Povezivanje s MongoDB-om
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Test ruta
app.get("/", (req, res) => {
  res.send("Backend radi!");
});

// Pokretanje servera
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
