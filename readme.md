# Server Side Languages Week 1 module 1.5
I chose to create a user management api. The api is intenteded to be fairly flexible with the model. 

## User Model
The model can have additional fields necessary however these fields are used to manage the integrity of the records. 

| key | required | unique |
| --- | -------- | ------ |
| firstName | &#9745; | &#9746; |
| lastName | &#9745; | &#9746; |
| password |  &#9745; | &#9746; |
| username | &#9745; | &#9745; |
| email | &#9745; | &#9745; |

---
## API Endpoints

### Get User (GET:\<hostname\>:\<port\>/users)
Returns the collection of users. 

### Get User by ID (GET:\<hostname\>:\<port\>/users/:id)
Returns a user with the corresponding ID if one exists.

### Create User (POST:\<hostname\>:\<port\>/users)
Creates a user as long as all reqired and unique fields are provided properly. 

### Update User (PUT:\<hostname\>:\<port\>/users/:id)
Update the user. this endpoint does not require all required fields be provided. If however a unique field is updates this will confirm the unique fields are still unique. 

### Delete User (DELETE:\<hostname\>:\<port\>/users/:id)
Delete a record at the corresponding id