const urlRepository = require("../repositories/url.repositories");
const counterRepository = require("../repositories/counter.repositories");
const { encode } = require("./base62");

const createShortUrl = async (longUrl) => {

    const counter = await counterRepository.getNextSequence();

    const shortId = encode(counter.seq);

    const newUrl = await urlRepository.create({
        shortId,
        longUrl,
    });

    return {
        shortId,
        longUrl: newUrl.longUrl,
        shortUrl: `${process.env.BASE_URL}/${shortId}`,
    };
};

const getOriginalUrl = async (shortId) => {
    return await urlRepository.findByShortId(shortId);
};

module.exports = {
    createShortUrl,
    getOriginalUrl,
};