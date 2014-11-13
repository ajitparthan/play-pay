play-pay
=======

### Installing

* Make sure you have [nodejs](http://nodejs.org) installed. 
* Make sure you have [Bower](http://bower.io) installed.
* Clone from `git` repo
* Install `nodejs` modules
```
cd <repo_directory>
npm install
```
* Install `Bower` modules
```
cd <repo_directory>
bower install
```
* Install `ember-cli`
```
npm install -g ember-cli
```
* Start server
```
cd <repo_directory>
ember server
```

#### API Reference

Path | HTTP Verb | Description
--- | --- | ---
/api/users | GET | Get all users
/api/users/:email_id | GET | Get user with specified email ID
/api/users | POST | Create a new users
/api/transfers | GET | Get all transfers
/api/transfers | POST | New request to transfer money from one user to another
/api/transfers/:email_id | GET | Get all transfers for the email ID


* **GET /api/users** - Returns all users

Response JSON

```
{
    "users": [
        {
            "name": "nickname1",
            "email_id": "a1@b.c",
            "balance": 100,
            "rowid": 1
        },
        {
            "name": "nickname",
            "email_id": "a@b.c",
            "balance": 100,
            "rowid": 2
        }
    ]
}
```
* **POST /api/users** - Create new user

Request JSON
```
{
    "name": "nickname2",
    "email_id": "a2@b.c",
    "password": "password"
}
```
* **GET /api/transfers** - Returns all users

Response JSON

```
{
    "requests": [
        {
            "from_email_id": "user1@domain.com",
            "to_email_id": "user2@domain.com",
            "amount": 10,
            "transfer_date": 1415630573620,
            "rowid": 3
        }
    ]
}
```

* **POST /api/transfers** - New request to transfer money from one user to another

Request JSON
```
{
    "from_email_id": "user1@domain.com",
    "to_email_id": "user2@domain.com",
    "amount": 90
}
```
*NOTE: While the API allows setting a `from_email_id`, the request wil be rejected if it does not match that of current making the API request*

* Relying on SQL CHECK constraint on balance to disallow transfers if not enough balance. Ideally should do check in code and send back with friendlier message.
* Relying on SQL unique constraint to do check if emailid is already registered and showing message from SQL directly. Ideally should have friendlier message.
* Restricting to round dollar transactions
* Storing passwords in clear- should really be hashed
* Using same table to store user and account details. Ideally should separate these 2.
