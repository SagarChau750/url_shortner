const express = require("express");
const router = express.Router();
const {validateCreateShortUrl} = require("../middlrewares/validate.middleware");

const {
    createShortUrl, redirectUrl 
} = require("../controller/url.controller");

router.post(
    "/shorten",
    validateCreateShortUrl,
    createShortUrl
);

router.get("/:shortId", redirectUrl);

module.exports = router;