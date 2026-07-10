const express = require("express");
const router = express.Router();

const {
    createShortUrl, redirectUrl 
} = require("../controller/url.controller");

router.post("/shorten", createShortUrl);
router.get("/:shortId", redirectUrl);

module.exports = router;