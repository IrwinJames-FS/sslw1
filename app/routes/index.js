const express = require("express");
const router = express.Router();
const { v4 } = require("uuid");

//most storage methods will utilize uuid or ulid to index records this will be able to mimick that behavior better then an array
var users = {}; 

/**
 * A middleware to fetch the user from the store or error out in a standard manner
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getUser = (req, res, next) => {
	const { id } = req.params;
	const user = users[id];

	if (!user) {
		return res.status(404).json({
			message: "User not found",
			id
		});
	}

	req.user = user;
	return next();
}

/**
 * Validate the request body to ensure the information provided is 
 * @param {*} req 
 * @param {*} res 
 
 */
const validateUser = (req, res, next) => {
	const { user } = req.body;
	const {firstName, lastName, username, email, password, ...rest} = user;
	
	
	//error out if unsupported parameters are provided
	const extraKeys = Object.keys(rest);
	if (extraKeys.length > 0) {
		return res.status(400).json({
			message: `Bad Request: Invalid fields provided [${extraKeys.join(", ")}]`,
			user,
		});
	}

	//Confirm all fields are provided and are strings that are not empty.
	const requiredFields = ['firstName', 'lastName', 'username', 'email', 'password'];
	const erroneousFields = requiredFields.filter(key => {
		const value = user[key];
		return value == undefined || typeof value !== string || value.trim().length === 0
	});

	if (erroneousFields.length > 0) {
		return res.status(400).json({
			message: `Bad Request: The following fields are either invalid or not provided [${erroneousFields.join(', ')}]`,
			user
		})
	}

	return next()
}

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
router.post("/", validateUser, (req, res) => {
	//It is safe to assume a valid user has been provided however additional validation is necessary to ensure user does not already exist.
	const {user} = req.body;
	
	const uniqueFields = ['username', 'email'];
	const matches = Object.keys(users).filter(id => {
		const usr = users[id];
		return uniqueFields.filter(key => usr[key] === user[key]).length;
	})
	
	//If this is greater then 0 then respond with an error
	if (matches.length > 0){
		const conflictKey = uniqueFields.filter(key => user[key] === matches[0][key]);
		return res.status(409).json({
			message: `This ${conflictKey} is already taken`,
			user
		});
	}

	const id = v4();
	//Insert request body
	users[id] = body
	res.status(201).json({
		message: "POST - API",
		id,
	});
});

//PUT - localhost:3000/api/:id
router.put("/:id", getUser, validateUser, (req, res) => {
	//because of the getUser middleware we can assume the user is defined.
	//We can also assume the user is valid due to the validateUser middleware however this means that a full record of the user must be provided in req.body
	const { id } = req.params;
	//Update the user
	users[id] = req.body; 

	//Report success
	res.status(200).json({
		message: "User updated",
		id,
		user: users[id] //refetch the user
	});
});

//DELETE - localhost:3000/api/:id
router.delete("/:id", getUser, (req, res) => {
	const { id } = req.params;
	
	res.status(204).json({
		message: "User deleted",
		id
	});
});

module.exports = router;