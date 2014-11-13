var sqlite3=require('sqlite3').verbose();
var dbFile = "/tmp/playpay.sqlite3";

console.log("Initing DB at "+dbFile+" ...");
var db = new sqlite3.Database(dbFile);

db.serialize(function() {
	console.log("Creating tables...");
	db.run("CREATE TABLE IF NOT EXISTS user (name TEXT, " +
						"email_id TEXT PRIMARY KEY, " +
						"password_hash TEXT, " +
						"balance INTEGER CHECK (balance>=0), "+
						"created DATETIME, " +
						"last_updated DATETIME)");

	db.run("CREATE TABLE IF NOT EXISTS transfer (from_email_id TEXT, " +
						"to_email_id TEXT, " +
						"amount INTEGER, "+
						"transfer_date DATETIME )");
	
});


module.exports = function(app) {
  var express = require('express');
  var expressJwt = require('express-jwt');
  var jwt = require('jsonwebtoken');
  
  // unprotected routes
  app.post("/api-token-auth", function(req, res) {
	  console.log(req.route);
	  
	  	var email_id=req.body.username;
	  	
		//Using "all" call as not expecting lot of rows
		db.all("SELECT password_hash, name FROM user WHERE email_id=?",email_id,function(err, rows) {
			if(rows.length==1 && req.body.password==rows[0].password_hash) {
				var profile={email_id: email_id, name:rows[0].name};
				var token = jwt.sign(profile, "secreeeete", { expiresInMinutes: 60*5 });

				console.log("Valid login with "+email_id);
				res.json({token:token, email_id:email_id});				
			} else {
				console.log("Invalid login with "+email_id);
				res.status(401).send('Invalid user or password');
			}
		});
	});
  
  app.post("/api/users", function(req, res) {
	  console.log(req.route);
	  
	  	var user=req.body.user;
		var d=new Date();
		var password_hash=user.password; //should really hash instead of storing plain text
		
		if(!user.name || !user.email_id || !password_hash) {
			console.log(req.body);
			res.status(422).send("Missing parameters 'name', 'email_id' and 'password' are all needed to create a user record.");

			return;			
		} 
		
		db.run("INSERT INTO user (name, email_id, password_hash, balance, created, last_updated) VALUES (?, ?, ?, ?, ?, ?)", 
			user.name, user.email_id, password_hash,100,d.getTime(),d.getTime(), 
			function(err) {
				if(err) {
					console.error(err);
					res.status(422).send(err.message);
				} else {
					res.status(200).send({});
				}
		});				
	});
  
    
  
  // after this all routes under "/api" will be protected
  app.use('/api', expressJwt({secret: "secreeeete"}));
  
  var playPayRouter = express.Router();
  
  playPayRouter.get("/users", function(req, res) {
	  console.log(req.route);
	  
		//Using "all" call as not expecting lot of rows
	    db.all("SELECT name, email_id, balance, email_id AS 'id', created, last_updated FROM user", function(err, rows) {
	        res.json({"users":rows});
	    });
	});
	


  playPayRouter.get("/users/:email_id", function(req, res) {
	  console.log(req.route);
	  
		//Using "all" call as not expecting lot of rows
	    db.all("SELECT name, email_id, balance, ROWID as 'id', created, last_updated FROM user WHERE email_id=?",req.params.email_id,function(err, rows) {
			if(err) {
				console.error(err);
				res.status(500).send(err.message);
			} else {
				res.json({"user":rows[0]});
			}
	    	
	    });
	});

  playPayRouter.get("/transfers", function(req, res) {
	  console.log(req.query);
	  
		//Using "all" call as not expecting lot of rows
	  if(req.query.email_id) {
			db.all("SELECT from_email_id, to_email_id, amount, transfer_date, ROWID as 'id' FROM transfer WHERE from_email_id=? OR to_email_id=?", req.query.email_id, req.query.email_id, function(err, rows) {
				res.json({"transfers":rows});
			});

	  } else {
		db.all("SELECT from_email_id, to_email_id, amount, transfer_date, ROWID as 'id' FROM transfer", function(err, rows) {
			res.json({"transfers":rows});
		});
	  }
	});
	
  playPayRouter.post("/transfers", function(req, res) {
	  console.log(req.route);
	  
		var d=new Date();
		var transfer=req.body.transfer;
	
		if(!transfer.from_email_id || !transfer.to_email_id || !transfer.amount) {
			res.status(422).send("Missing mandatory parameters- 'from_email_id', 'to_email_id' and 'amount' are all needed to initiate a transfer.");
			
			return;
		} 
		if(!(transfer.amount>0)) {
			res.status(422).send("Amount to transfer has to be greater than 0");
			
			return;			
		}
			
		db.serialize(function() {
			db.exec("BEGIN");
			
			db.run("INSERT INTO transfer (from_email_id, to_email_id, amount, transfer_date) VALUES (?, ?, ?, ?)", 
				transfer.from_email_id, transfer.to_email_id, transfer.amount,d.getTime(), 
				function(err) {
					if(err) {					
						console.error(err);
						res.status(422).send(err.message);
						db.exec("ROLLBACK");
					} else {
						db.run("UPDATE user SET balance=balance-?, last_updated=? WHERE email_id=?", 
								transfer.amount,d.getTime(),transfer.from_email_id, 
								function(err) {
									if(err) {					
										console.error(err);
										res.status(422).send(err.message);
										db.exec("ROLLBACK");
									} else {
										db.run("UPDATE user SET balance=balance+?, last_updated=? WHERE email_id=?", 
												transfer.amount,d.getTime(),transfer.to_email_id, 
												function(err) {
													if(err) {					
														console.error(err);
														res.status(422).send(err.message);
														db.exec("ROLLBACK");
													} else {
														db.exec("COMMIT");
														res.status(200).send({});
													}
											});	
										
									}
							});	
						
					}
			});		
						
			
		});
		
	});

  playPayRouter.get("/transfers/:transfer_id", function(req, res) {
	  console.log(req.route);
	  
		//Using "all" call as not expecting lot of rows
		db.all("SELECT from_email_id, to_email_id, amount, transfer_date, ROWID as 'id' FROM transfer WHERE ROWID=?", req.params.transfer_id, function(err, rows) {
			res.json({"requests":rows});
		});
	});
  
  app.use('/api', playPayRouter);
  
  

  /*app.use(express.json());
  app.use(express.urlencoded());*/
};
