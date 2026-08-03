const { redisClient } = require("../config/redis");

const CACHE_TTL = Number(process.env.CACHE_TTL) || 3600;

/**
 * Cache both mappings:
 * short:<shortId> -> longUrl
 * long:<longUrl>  -> shortId
 */
const cacheUrl = async (shortId, longUrl) => {
    try {
        await Promise.all([
            redisClient.set(
                `short:${shortId}`,
                longUrl,
                { EX: CACHE_TTL }
            ),
            redisClient.set(
                `long:${longUrl}`,
                shortId,
                { EX: CACHE_TTL }
            ),
        ]);
    } catch (err) {
        console.error("Redis Cache Error:", err.message);
    }
};

/**
 * Get Short ID using Long URL
 */
const getShortIdFromCache = async (longUrl) => {
    try {
        return await redisClient.get(`long:${longUrl}`);
    } catch (err) {
        console.error("Redis GET Error:", err.message);
        return null;
    }
};

/**
 * Get Long URL using Short ID
 */
const getLongUrlFromCache = async (shortId) => {
    try {
        return await redisClient.get(`short:${shortId}`);
    } catch (err) {
        console.error("Redis GET Error:", err.message);
        return null;
    }
};



/**
 * Remove cache
 */
const deleteCache = async (shortId, longUrl) => {
    try {
        await Promise.all([
            redisClient.del(`short:${shortId}`),
            redisClient.del(`long:${longUrl}`),
        ]);
    } catch (err) {
        console.error("Redis Delete Error:", err.message);
    }
};

module.exports = {
    cacheUrl,
    getShortIdFromCache,
    getLongUrlFromCache,
    deleteCache,
};