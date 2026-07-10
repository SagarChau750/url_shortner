const { default: mongoose } = require("mongoose");

const urlSchema = new mongoose.Schema({
    shortId : {
        type:String,
        required:true,
        unique:true,
    },
    longUrl : {
        type:String,
        required:true,
    },
    createdAt : {
        type : Date,
        default : Date.now,

    },
    expiresAt : {
        type : Date,
    },
});
module.exports = mongoose.model("URL", urlSchema);