# Hybr1d

Note: 
1. phpMyAdmin must be installed on your system. Documentation for reference - https://www.phpmyadmin.net/
2. Node must be installed on your system.

Steps to run the application - 
1. Clone the repository on your local.
2. Create a database named "hybr1d".
3. Run queries for creation on tables mentioned in "tables.txt" file.
4. Run npm i (it will install all the dependencies required to run the application).
5. Run "node app.js", it will run the application on localhost.
6. Then you can use Postman to make an API call.


## API

### User - 
1. /auth/register - User register
2. /auth/login - User login 

### Buyers - 
3. /buyer/list-of-sellers - Get the list of seller
4. /buyer/seller-catalog/:seller_id - Get the seller's catalog of a specific seller
5. /buyer/create-order/:seller_id - Create order with for a seller with id

### Sellers - 
6. /seller/create-catalog - Create catalog for a seller
7. /seller/orders - Retrieve the list of orders received by a seller
