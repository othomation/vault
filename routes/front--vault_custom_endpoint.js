const express = require("express");
const app = express.Router();
const AREA_REGEX = new RegExp("^[a-zA-Z0-9_-]*$");
app.get("/", (req, res) => {
	if (AREA_REGEX.test(req.params.room)) {
		res.render("room", { roomId: req.params.room });
	} else {
		res.redirect("back");
	}
});
module.exports = app;
