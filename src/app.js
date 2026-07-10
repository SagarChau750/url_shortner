const express = require("express");

const app = express();
const urlRoutes = require("./routes/url.routes");

app.use(express.json());

app.use("/", urlRoutes);

app.get("/", (req, res) =>{
    res.send("url shortener api is runing...");
});

module.exports = app;