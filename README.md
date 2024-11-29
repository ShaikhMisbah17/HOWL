Documentation
#Setup:
1.	Clone the repo
2.	 Run `npm install` to install dependencies.
3.	 Set up a MongoDB instance and update `.env` with the Mongo URI.
4.	 Run the server: `node app.js`.
5.	 Run tests: `npm test`.

#Explanation:
	Start the server first by running your Node.js application. 
	Make sure MongoDB is running and accessible.
	Follow the testing flow sequence: register → login → other operations.
	Keep an eye on the token expiration (set to 1 hour)

#Endpoints:
1. User Registration
Register a new user in the system.
•	URL: /register
•	Method: POST
•	Auth Required: No
•	Content-Type: application/json

2. User Login
Login to get an authentication token.
•	URL: /login
•	Method: POST
•	Auth Required: No
•	Content-Type: application/json

3. Create Product
Add a new product to the database.
•	URL: /products
•	Method: POST
•	Auth Required: Yes
•	Content-Type: application/json

4. Get All Products
Retrieve all products from the database.
•	URL: /products
•	Method: GET
•	Auth Required: No

5. Update Product
Update an existing product.
•	URL: /products/:id
•	Method: PUT
•	Auth Required: Yes
•	Content-Type: application/json

6. Delete Product
Delete a product from the database.
•	URL: /products/:id
•	Method: DELETE
•	Auth Required: Yes

#Setting Up in Postman
1.	Environment Setup 
o	Create a new environment in Postman
o	Add these variables: 
	base_url: http://localhost:3000/api
	token: Leave empty (will be filled after login)

           Create Product: POST /api/products 
           Update Product: PUT /api/products/:id 
           Delete Product: DELETE /api/products/:id

2.	Collection Setup 
o	Create a new collection
o	For protected routes, go to the Authorization tab and select: 
	Type: "Bearer Token"
	Token: {{token}}

3.	Testing Flow 
o	Register a user (POST /register)
o	Login (POST /login)
o	In the login request's "Tests" tab, add this script to automatically save the token:
Javascript:
if (pm.response.code === 200) {
    pm.environment.set("token", pm.response.json().token);
}

4.	Test other endpoints using the saved token

#Required Environment Variables
Make sure to set up a .env file with these variables:
  MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET   
  











