const {nanoid} = require("nanoid");
const URL = require("../models/url.model");

//post /shorten

exports.createShortUrl = async (req, res)=>{
    try{
        const {longUrl} = req.body;

        if(!longUrl){
            return res.status(400).json({message:"long url is required"});
        }
        const shortId = nanoid(6);
        const newUrl = await URL.create({
            shortId, longUrl,
        });

        const shortUrl = `${process.env.BASE_URL}/${shortId}`;

        res.status(201).json({
            shortUrl, longUrl:newUrl.longUrl,
        });
    }catch(err){
        res.status(500).json({message: "server error"});
    }
};

//get /:shortId

exports.redirectUrl = async(req, res)=>{
    try{
        const{shortId} = req.params;
        const url = await URL.findOne({shortId});

        if(!url){
            return res.status(404).json({message: " URL not Found"});
        }
        res.redirect(url.longUrl);
    }catch(error){
        res.status(500).json({message : "server error"});
    }
}