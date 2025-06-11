const express = require("express");
const multer = require("multer");
const { storage } = require("../utils/cloudinary");
const router = express.Router();

const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  res.send({ imagePath: req.file.path });
});

module.exports = router;
