const express = require("express");
const app = express.Router();
const { v4: uuidV4 } = require("uuid");


app.get("/", (req, res) => {
	res.redirect(`/${uuidV4()}`);
});
module.exports = app;
