const express = require("express");
const router = express.Router();

//most storage methods will utilize uuid or ulid to index records this will be able to mimick that behavior better then an array
var users = {}; 

//GET - localhost:3000/api
router.get("/", (req, res) => res.status(200).json({
	message: "GET - API",
	metadata: {
		hostname: req.hostname,
		method: req.method
	}
}));

//GET - localhost:3000/api/:id
router.get("/:id", (req, res) => {
	const { id } = req.params

	res.status(200).json({
		message: "POST - API with id",
		id,
	});
	
});

//POST - localhost:3000/api
router.post("/", (req, res) => {
	const { data } = req.body;
	console.log(data);
	res.status(200).json({
		message: "POST - API",
		data: data
	})
});

module.exports = router;