/*
A basic router using express
*/

const express = require("express");
const app = express();
const router = require("./routes");

app.use(express.json());

app.get("/", (req, res) => res.status(200).json({
	message: "GET to API",
	metadata: {
		hostname: req.hostname,
		method: req.method
	}
}));

app.use("/api", router);

module.exports = app;