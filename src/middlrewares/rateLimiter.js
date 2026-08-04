const { redisClient } = require("../config/redis");

const WINDOW_SIZE = 60;
const MAX_REQUESTS = 5;

const rateLimiter = async (req, res, next) => {

    try {

        const ip = req.ip;

        const key = `rate:${ip}`;

        const requestCount = await redisClient.incr(key);

        if (requestCount === 1) {
            await redisClient.expire(key, WINDOW_SIZE);
        }

        // Block request if limit exceeded
        if (requestCount > MAX_REQUESTS) {

            const retryAfter = await redisClient.ttl(key);

            return res.status(429).json({
                success: false,
                message: "Too many requests. Please try again later.",
                retryAfter,
            });

        }

        console.log("IP:", ip);
        console.log("Request Count:", requestCount);

        next();

    } catch (err) {
        next(err);
    }
};

module.exports = rateLimiter;