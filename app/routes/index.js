const express = require("express");
const router = express.Router();
const { v4 } = require("uuid");

//most storage methods will utilize uuid or ulid to index records this will be able to mimick that behavior better then an array
var users = {}; 

//GET - localhost:3000/api
router.get("/", (req, res) => res.status(200).json({
	users
}));

//GET - localhost:3000/api/:id
router.get("/:id", (req, res) => {
	const { id } = req.params
	const user = users[id];

	if (!user){
		//Respond with not found
		return res.status(404).json({
			message: "User not found",
			id
		});
	}

	res.status(200).json({
		id,
		user
	});
});

//POST - localhost:3000/api
router.post("/", (req, res) => {
	const body = req.body;
	const id = v4();
	//Insert request body
	//TODO: - Data validation
	users[id] = body
	res.status(201).json({
		message: "POST - API",
		id,
	});
});

//PUT - localhost:3000/api/:id
router.put("/:id", (req, res) => {
	const { id } = req.params;
	const user = users[id];

	if(!user){
		return res.status(404).json({
			message: "User not found",
			id
		});
	}

	//Update the user
	//TODO: Data Validation
	users[id] = {...user, ...req.body}; //combine the two objects with req.body taking precedence of overlapping information.

	//Report success
	res.status(200).json({
		message: "User updated",
		id,
		user: users[id] //refetch the user
	});
});

//DELETE - localhost:3000/api/:id
router.delete("/:id", (req, res) => {
	const { id } = req.params;
	const user = users[id];

	if (!user) {
		return res.status(404).json({
			message: "User not found",
			id
		});
	}

	res.status(204).json({
		message: "User deleted",
		id
	});
});

module.exports = router;