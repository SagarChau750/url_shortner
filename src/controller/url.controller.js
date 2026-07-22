const URL = require("../models/url.model");
const Counter = require("../models/counter.model");
const { encode } = require("../services/base62");

// POST /shorten
exports.createShortUrl = async (req, res) => {
    try {
        const { longUrl } = req.body;

        if (!longUrl) {
            return res.status(400).json({
                message: "Long URL is required",
            });
        }

        // Generate the next sequence number
        const counter = await Counter.findOneAndUpdate(
            { _id: "urlCounter" },
            { $inc: { seq: 1 } },
            {
                new: true,
                upsert: true,
            }
        );

        // Convert sequence number to Base62
        const shortId = encode(counter.seq);

        // Save URL
        const newUrl = await URL.create({
            shortId,
            longUrl,
        });

        const shortUrl = `${process.env.BASE_URL}/${shortId}`;

        res.status(201).json({
            message: "Short URL created successfully",
            shortUrl,
            shortId,
            longUrl: newUrl.longUrl,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// GET /:shortId
exports.redirectUrl = async (req, res) => {
    try {
        const { shortId } = req.params;

        const url = await URL.findOne({ shortId });

        if (!url) {
            return res.status(404).json({
                message: "URL not found",
            });
        }

        return res.redirect(url.longUrl);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};