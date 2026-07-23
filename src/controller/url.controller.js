const urlService = require("../services/url.service");
const asyncHandler = require("../middlrewares/asyncHandler");
const AppError = require("../utils/AppError");

// POST /shorten
exports.createShortUrl = asyncHandler(async (req, res) => {
    const result = await urlService.createShortUrl(req.body.longUrl);

    return res.status(201).json({
        success: true,
        message: "Short URL created successfully",
        data: result,
    });
});

// GET /:shortId
exports.redirectUrl = asyncHandler(async (req, res) => {
    const { shortId } = req.params;

    const url = await urlService.getOriginalUrl(shortId);

    if (!url) {
    throw new AppError("URL not found", 404);
}

    return res.redirect(url.longUrl);
});