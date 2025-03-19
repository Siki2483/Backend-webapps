const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { route } = require("./auth");

router.get("/", auth, async (req, res) => {
    try {
        
        const restorani = [
            { id: 1, name: "Restoran 1 test"},
            { id: 2, name: "Restoran 2 test"},
        ];

        res.json(restorani);
    }

    catch(err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;