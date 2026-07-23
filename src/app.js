const express = require("express");

const app = express();
const urlRoutes = require("./routes/url.routes");
const errorHandler = require("./middlrewares/error.middleware");
app.use(express.json());

app.use("/", urlRoutes);

app.get("/", (req, res) =>{
    res.send("url shortener api is runing...");
});
app.use(errorHandler);
module.exports = app;