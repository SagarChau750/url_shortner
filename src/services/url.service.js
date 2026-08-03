const urlRepository = require("../repositories/url.repositories");
const counterRepository = require("../repositories/counter.repositories");
const { encode } = require("./base62");
const {redisClient} = require("../config/redis");


const createShortUrl = async (longUrl) => {
    // ---------- 1. Check Redis ----------
    try {
        const cachedShortId = await redisClient.get(`long:${longUrl}`);

        if (cachedShortId) {
            console.log("✅ Duplicate URL found in Redis");

            return {
                shortId: cachedShortId,
                longUrl,
                shortUrl: `${process.env.BASE_URL}/${cachedShortId}`,
            };
        }
    } catch (err) {
        console.error("Redis GET Error:", err.message);
    }

    // ---------- 2. Check MongoDB ----------
    const existingUrl = await urlRepository.findByLongUrl(longUrl);

    if (existingUrl) {
        console.log("📦 Duplicate URL found in MongoDB");

        // Cache both mappings (ignore Redis failure)
        try {
            await Promise.all([
                redisClient.set(
                    `long:${existingUrl.longUrl}`,
                    existingUrl.shortId,
                    { EX: 3600 }
                ),
                redisClient.set(
                    `short:${existingUrl.shortId}`,
                    existingUrl.longUrl,
                    { EX: 3600 }
                )
            ]);
        } catch (err) {
            console.error("Redis SET Error:", err.message);
        }

        return {
            shortId: existingUrl.shortId,
            longUrl: existingUrl.longUrl,
            shortUrl: `${process.env.BASE_URL}/${existingUrl.shortId}`,
        };
    }

    // ---------- 3. Generate New Short ID ----------
    const counter = await counterRepository.getNextSequence();
    const shortId = encode(counter.seq);

    try {
        // ---------- 4. Save to MongoDB ----------
        const newUrl = await urlRepository.create({
            shortId,
            longUrl,
        });

        // ---------- 5. Cache Both Mappings ----------
        try {
            await Promise.all([
                redisClient.set(
                    `long:${newUrl.longUrl}`,
                    shortId,
                    { EX: 3600 }
                ),
                redisClient.set(
                    `short:${shortId}`,
                    newUrl.longUrl,
                    { EX: 3600 }
                )
            ]);
        } catch (err) {
            console.error("Redis SET Error:", err.message);
        }

        return {
            shortId,
            longUrl: newUrl.longUrl,
            shortUrl: `${process.env.BASE_URL}/${shortId}`,
        };

    } catch (err) {

        // ---------- 6. Handle Duplicate URL Race Condition ----------
        if (err.code === 11000) {
            console.log("⚠️ Duplicate key detected. Fetching existing URL...");

            const existingUrl = await urlRepository.findByLongUrl(longUrl);

            if (!existingUrl) {
                throw err;
            }

            // Cache both mappings
            try {
                await Promise.all([
                    redisClient.set(
                        `long:${existingUrl.longUrl}`,
                        existingUrl.shortId,
                        { EX: 3600 }
                    ),
                    redisClient.set(
                        `short:${existingUrl.shortId}`,
                        existingUrl.longUrl,
                        { EX: 3600 }
                    )
                ]);
            } catch (redisErr) {
                console.error("Redis SET Error:", redisErr.message);
            }

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

    const cachedUrl = await redisClient.get(shortId);

    if (cachedUrl) {
        console.log("✅ Cache HIT");

        return {
            longUrl: cachedUrl,
        };
    }

    console.log("❌ Cache MISS");

    const url = await urlRepository.findByShortId(shortId);

    if (!url) {
        return null;
    }

    // Store in Redis
    await redisClient.set(shortId, url.longUrl, {
        EX: 7200,
    });

    return url;
};
module.exports = {
    createShortUrl,
    getOriginalUrl,
};