require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();


app.use(express.json());
app.use(cors());


const uploadDir = path.join(__dirname, "/public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));


app.use("/api/auth", require("./routes/auth"));
app.use("/api/restaurants", require("./routes/restorani"));
app.use("/api/locations", require("./routes/locations"));
app.use("/api/nightlife", require("./routes/Nightlife"));
app.use("/api/upload", require("./routes/upload"));
app.use(require("./middleware/errorHandler"));


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


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
