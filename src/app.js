const express = require("express");
const rateLimiter = require("./middlrewares/rateLimiter");
const app = express();
const urlRoutes = require("./routes/url.routes");
const errorHandler = require("./middlrewares/error.middleware");
app.use(express.json());
app.use(rateLimiter);
app.use("/", urlRoutes);

app.get("/", (req, res) =>{
    res.send("url shortener api is runing...");
});
app.use(errorHandler);
module.exports = app;