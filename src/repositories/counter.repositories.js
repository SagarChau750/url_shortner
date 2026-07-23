const Counter = require("../models/counter.model");

const getNextSequence = async () => {
    return await Counter.findOneAndUpdate(
        { _id: "urlCounter" },
        { $inc: { seq: 1 } },
        {
            new: true,
            upsert: true,
        }
    );
};

module.exports = {
    getNextSequence,
};