/*
A basic router using express
*/

const express = require("express");
const app = express();


app.get("/", (req, res) => {
	res.status(200).json({
		message: "GET - root",
		metadata: {
			hostname: req.hostname,
			method: req.method,
		}
	});
});

module.export = app;