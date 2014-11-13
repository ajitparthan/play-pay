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
* [express-jwt](https://www.npmjs.org/package/express-jwt) provides support for JSON web-tokens which are used in the authentication and authorization flows

### Front end:
* [emberjs](http://emberjs.com) is used as MVC and JS framework
* [Twitter Boostrap](http://getbootstrap.com) is used for UI styling

#### API Reference

Path | HTTP Verb | Description
--- | --- | ---
/api/users | GET | Get all users
/api/users/:email_id | GET | Get user with specified email ID
/api/users | POST | Create a new users
/api/transfers | GET | Get all transfers
/api/transfers | POST | New request to transfer money from one user to another
/api/transfers/:email_id | GET | Get all transfers for the email ID


* Relying on SQL CHECK constraint on balance to disallow transfers if not enough balance. Ideally should do check in code and send back with friendlier message.
* Relying on SQL unique constraint to do check if emailid is already registered and showing message from SQL directly. Ideally should have friendlier message.
* Restricting to round dollar transactions
* Storing passwords in clear- should really be hashed
* Using same table to store user and account details. Ideally should separate these 2.
