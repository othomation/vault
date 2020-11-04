var express = require('express');
var app = express.Router();
app.get("/", function (req, res) {
    console.log(typeof res.render);
    res.render("index");
});
module.exports = app;
