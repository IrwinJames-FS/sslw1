///The required fields of the user model... a user can have additional fields but this is required
const requiredFields = ['firstName', 'lastName', 'username', 'password', 'email']

///The unique fields of the user model
const uniqueFields = ['username', 'email'];

module.exports = {
	requiredFields, uniqueFields
}