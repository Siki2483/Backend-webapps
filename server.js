require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use (express.json());
app.use (cors());
app.use ("/api/auth", require("./routes/auth"));
app.use ("/api/restaurants", require("./routes/restorani"));
app.use (require("./middleware/errorHandler"));


// Povezivanje s MongoDB-om
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Test ruta

app.get("/test", (req, res) => {
  res.send("Test ruta radi!");
});


app.get("/", (req, res) => {
  res.send("Backend radi!");
});

app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(`Ruta dostupna: ${middleware.route.path}`);
  } else if (middleware.name === "router") {
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        console.log(`Ruta dostupna: ${handler.route.path}`);
      }
    });
  }
});


// Pokretanje servera
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
