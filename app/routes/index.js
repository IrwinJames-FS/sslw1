const express = require("express");
const router = express.Router();
const { v4 } = require("uuid");
const { requiredFields, uniqueFields } = require("./users");

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
 * Returns a record that satisfies any portion of the q object
 * @param {*} q 
 */
const query = q => Object.keys(users).filter(id =>matchQ(users[id], q).length);

/**
 * Check if the user satisfies the query
 * @param {*} obj 
 * @param {*} q 
 * @returns string[] a list of keys that match the queue
 */
const matchQ = (obj, q) => Object.keys(q).filter(key => obj[key] === q[key]);

/**
 * A convenience method to build an object with only the provided keys
 * (destructuring is great for know keys however having keys set via a settings or config page does not really allow for that)
 * @param {*} obj 
 * @param {*} keys 
 * @returns 
 */
const reObj = (obj, keys) => {
	let nObj = {}
	for (const k of keys) {
		if(obj[k] !== undefined) {
			nObj[k] = obj[k]
		}
	}
	return nObj
}

//GET - localhost:3000/api
router.get("/", (_, res) => res.status(200).json({
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
	const user = req.body;
	//validate all required fields have been provided
	const invalidKeys = requiredFields.filter(key => {
		const value = user[key];
		return value === undefined || typeof value !== 'string' || value.trim().length == 0
	});
	if (invalidKeys.length > 0) {
		return res.status(400).json({
			message: `Bad Request: Missing or invalid fields provided (${invalidKeys.join(', ')})`,
			user
		});
	}

	//Verify that unique fields dont exist
	let q = reObj(user, uniqueFields);
	const matches = query(q).map(id=>users[id]);
	//If this is greater then 0 then respond with an error
	if (matches.length > 0){
		const conflictKey = matchQ(matches[0], q);
		return res.status(409).json({
			message: `This ${conflictKey.join(' & ')} is already taken`,
			user,
		});
	}

	const id = v4();
	//Insert request body
	users[id] = user;
	res.status(201).json({
		message: "POST - API",
		id,
	});
});



//PUT - localhost:3000/api/:id
router.put("/:id", getUser, (req, res) => {

	const { id } = req.params;
	const user = req.body;

	const invalidKeys = requiredFields.filter(key => {
		const value = user[key];
		if (value === undefined) return false; //put does not need all values to be provided
		return typeof value !== 'string' || value.trim().length == 0
	});

	if (invalidKeys.length > 0) {
		return res.status(400).json({
			message: `Bad Request: Invalid fields provided (${invalidKeys.join(', ')})`,
			user
		});
	}
	//check if new values are unique and still valid
	const providedKeys = Object.keys(req.body);
	if (uniqueFields.some(key => providedKeys.includes(key))) {
		const q = reObj(req.body, uniqueFields);
		const match = query(q).find(nid => nid != id);
		if (match){
			const conflictKey = matchQ(users[match], q)
			return res.status(409).json({
				message: `This ${conflictKey.join(' & ')} is already taken`,
				user,
			})
		}
	}
	//Update the user
	users[id] = {...req.user, ...req.body}; 

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
	delete users[id];
	res.status(204).json({
		message: "User deleted",
		id
	});
});

module.exports = router;