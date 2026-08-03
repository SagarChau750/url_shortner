const urlRepository = require("../repositories/url.repositories");
const counterRepository = require("../repositories/counter.repositories");
const { encode } = require("./base62");
const {redisClient} = require("../config/redis");

const {
    cacheUrl,
    getShortIdFromCache,getLongUrlFromCache
} = require("./cache.service");



const createShortUrl = async (longUrl) => {

    // -------------------------
    // 1. Check Redis
    // -------------------------

    const cachedShortId = await getShortIdFromCache(longUrl);

    if (cachedShortId) {
        console.log("✅ Duplicate URL found in Redis");

        return {
            shortId: cachedShortId,
            longUrl,
            shortUrl: `${process.env.BASE_URL}/${cachedShortId}`,
        };
    }

    // -------------------------
    // 2. Check MongoDB
    // -------------------------

    const existingUrl = await urlRepository.findByLongUrl(longUrl);

    if (existingUrl) {

        console.log("📦 Duplicate URL found in MongoDB");

        await cacheUrl(
            existingUrl.shortId,
            existingUrl.longUrl
        );

        return {
            shortId: existingUrl.shortId,
            longUrl: existingUrl.longUrl,
            shortUrl: `${process.env.BASE_URL}/${existingUrl.shortId}`,
        };
    }

    // -------------------------
    // 3. Generate Short ID
    // -------------------------

    const counter = await counterRepository.getNextSequence();

    const shortId = encode(counter.seq);

    try {

        // -------------------------
        // 4. Save in MongoDB
        // -------------------------

        const newUrl = await urlRepository.create({
            shortId,
            longUrl,
        });

        // -------------------------
        // 5. Cache
        // -------------------------

        await cacheUrl(
            newUrl.shortId,
            newUrl.longUrl
        );

        return {
            shortId: newUrl.shortId,
            longUrl: newUrl.longUrl,
            shortUrl: `${process.env.BASE_URL}/${newUrl.shortId}`,
        };

    } catch (err) {

        // -------------------------
        // 6. Race Condition
        // -------------------------

        if (err.code === 11000) {

            console.log("⚠️ Duplicate key detected");

            const existingUrl = await urlRepository.findByLongUrl(longUrl);

            if (!existingUrl) {
                throw err;
            }

            await cacheUrl(
                existingUrl.shortId,
                existingUrl.longUrl
            );

            return {
                shortId: existingUrl.shortId,
                longUrl: existingUrl.longUrl,
                shortUrl: `${process.env.BASE_URL}/${existingUrl.shortId}`,
            };
        }

        throw err;
    }
};

// const createShortUrl = async (longUrl) => {

//     const cachedShortId = await redisClient.get(`long:${longUrl}`);

//     if (cachedShortId) {
//         console.log("✅ Duplicate URL found in Redis");

//         return {
//             shortId: cachedShortId,
//             longUrl,
//             shortUrl: `${process.env.BASE_URL}/${cachedShortId}`,
//         };
//     }

//   const existingUrl = await urlRepository.findByLongUrl(longUrl);

//     if (existingUrl) {

//         console.log("📦 Duplicate URL found in MongoDB");

//         // Cache it for future requests
//         await redisClient.set(
//             `long:${longUrl}`,
//             existingUrl.shortId,
//             {
//                 EX: 3600,
//             }
//         );

//         return {
//             shortId: existingUrl.shortId,
//             longUrl: existingUrl.longUrl,
//             shortUrl: `${process.env.BASE_URL}/${existingUrl.shortId}`,
//         };
//     }
//    const counter = await counterRepository.getNextSequence();

//     const shortId = encode(counter.seq);

//     try {

//         const newUrl = await urlRepository.create({
//             shortId,
//             longUrl,
//         });

//         return {
//             shortId,
//             longUrl: newUrl.longUrl,
//             shortUrl: `${process.env.BASE_URL}/${shortId}`,
//         };

//     } catch (err) {

//         // Duplicate Key Error
//         if (err.code === 11000) {

//             const existingUrl = await urlRepository.findByLongUrl(longUrl);

//             return {
//                 shortId: existingUrl.shortId,
//                 longUrl: existingUrl.longUrl,
//                 shortUrl: `${process.env.BASE_URL}/${existingUrl.shortId}`,
//             };
//         }

//         throw err;
//     }
// };

// const getOriginalUrl = async (shortId) => {
//     return await urlRepository.findByShortId(shortId);
// };
// const getOriginalUrl = async (shortId) => {

//     const cachedUrl = await redisClient.get(shortId);

//     if (cachedUrl) {
//         console.log("✅ Cache HIT");
//         return {
//             longUrl: cachedUrl,
//         };
//     }

//     console.log("❌ Cache MISS");

//     return await urlRepository.findByShortId(shortId);
// };
const getOriginalUrl = async (shortId) => {

    // -------------------------
    // 1. Check Redis
    // -------------------------

    const cachedLongUrl = await getLongUrlFromCache(shortId);

    if (cachedLongUrl) {

        console.log("✅ Cache HIT");

        return {
            longUrl: cachedLongUrl,
        };
    }

    console.log("❌ Cache MISS");

    // -------------------------
    // 2. Check MongoDB
    // -------------------------

    const url = await urlRepository.findByShortId(shortId);

    if (!url) {
        return null;
    }

    // -------------------------
    // 3. Cache for future requests
    // -------------------------

    await cacheUrl(
        url.shortId,
        url.longUrl
    );

    return url;
};
module.exports = {
    createShortUrl,
    getOriginalUrl,
};