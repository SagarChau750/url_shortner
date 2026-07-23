const validator = require("validator");

const validateCreateShortUrl = (req, res, next) => {
    const {longUrl} = req.body;

    //check if url exist
    if(!longUrl){
        return res.status(400).json({
            success: false,
            message : "Long url is requrired",
        });
    }

    //check if is valid
    if(!validator.isURL(longUrl, {
        protocols : ["http", "https"],
        require_protocol : true,
    })) {
        return res.status(400).json({
            success:false,
            message:"Please provide a valid url",
        });
    }
    next();
}

module.exports = {
    validateCreateShortUrl,
};