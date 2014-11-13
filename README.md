Welcome to the play-pay wiki! Simple money transfer application.

## Installing

* Make sure you have [nodejs](http://nodejs.org) installed. 
* Make sure you have [Bower](http://bower.io) installed.
* Install [ember-cli](http://www.ember-cli.com) 
```
npm install -g ember-cli
```
* Clone from `git` repo
* Go to repo directory
```
cd <repo_directory>
```
* Install `nodejs` modules
```
npm install
```
* Install `Bower` modules
```
bower install
```
* Start server
```
ember server
```

## Tech stack
### Backend tech stack:
* [nodejs](http://nodejs.org) is used as app server
* [Express](http://expressjs.com) is used for web application framework
* [sqlite3](https://github.com/mapbox/node-sqlite3/wiki) is used for persistence 
* [express-jwt](https://www.npmjs.org/package/express-jwt) provides support for JSON web-tokens (JWT) which are used in the authentication and authorization flows

### Front end:
* [emberjs](http://emberjs.com) is used as MVC and JS framework
* [Twitter Boostrap](http://getbootstrap.com) is used for UI styling

## Model
The app is modeled using 2 tables.

**user** table stores user details and account balance
```
CREATE TABLE IF NOT EXISTS user 
        (name TEXT, " +
	"email_id TEXT PRIMARY KEY, " +
	"password_hash TEXT, " +
	"user_type TEXT, "+
	"balance INTEGER CHECK (balance>=0), "+
	"created DATETIME, " +
	"last_updated DATETIME)
```
This also has business constraints and rules:
* `email_id` is used as id throughtout and hence must be unique
* `balance` must be greater than 0 for each account
* Assuming transactions are in round numbers only


**transfer** table stores transfer details
```
CREATE TABLE IF NOT EXISTS transfer 
        (from_email_id TEXT, " +
	"to_email_id TEXT, " +
	"amount INTEGER, "+
	"transfer_date DATETIME)
```
No foreign key constraints here as there is some thought that even if user data gets archived the transfer history may need to be preserved. So ensuring transfers are happening between bonafide accounts is done at the app code layer.

## API Reference

RESTful APIs around the `user` and `transfer` objects. The only exception is the `/api-auth-token` endpoint which used for authorization/authentication.

Authentication is done by doing a `POST` on the authentication end point `/api-auth-token`. The body is a JSON containing username and password.
```JSON
{
username: <user's email_id>, 
password: <user's password>
}
```
If authneitcated this will return a `token` in the response.

Accessing protected endpoints need the token obtained from authentication process to be passed in the header.
```
Authorization: Bearer <token>
```

Path | Verb | Description
--- | --- | ---
/api/users | POST | Create a new user. This is an unprotected end-point.
/api-auth-token | POST | Authenticate and get credentials token (JWT). This is an unprotected end-point.
/api/users (protected) | GET | Get all users. This is only allowed for admin users.
/api/users/:email_id (protected) | GET | Get user with specified email ID. Normal users can only get their user details.
/api/transfers (protected) | GET | Get all transfers. This is only allowed for admin users.
/api/transfers (protected) | POST | New request to transfer money from one user to another. Though `transfer` model has a `from_email_id` and a `to_email_id`, users are allowed to only transfer their account.
/api/transfers/:email_id (protected) | GET | Get all transfers for the email ID. Normal users can only get their transfer details.


* Relying on SQL CHECK constraint on balance to disallow transfers if not enough balance. Ideally should do check in code and send back with friendlier message.
* Relying on SQL unique constraint to do check if emailid is already registered and showing message from SQL directly. Ideally should have friendlier message.
* Restricting to round dollar transactions
* Storing passwords in clear- should really be hashed
* Using same table to store user and account details. Ideally should separate these 2.
