const URL = require("../models/url.model");

const create = async (data) => {
    return await URL.create(data);
};

const findByShortId = async (shortId) => {
    return await URL.findOne({ shortId });
};

const findByLongUrl = async (longUrl) => {
    return await URL.findOne({ longUrl });
};

module.exports = {
    create,
    findByShortId,
    findByLongUrl,
};