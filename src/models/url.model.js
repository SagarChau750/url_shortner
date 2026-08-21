const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
    {
        shortId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        longUrl: {
            type: String,
            required: true,
            unique: true,
        },

        clicks: {
            type: Number,
            default: 0,
        },

        lastVisited: {
            type: Date,
            default: null,
        },

        expiresAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Url", urlSchema);