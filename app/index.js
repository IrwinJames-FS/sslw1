/*
A basic router using express
*/

const express = require("express");
const app = express();
const router = require("./routes");

app.use(express.json());

app.get("/", (req, res) => {
	res.status(200);
	res.setHeader("Content-Type", "text/html");
	res.write("<h1>Service is up</h1>")
});

app.use("/users", router);

module.exports = app;