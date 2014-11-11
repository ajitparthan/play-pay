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
  var playPayRouter = express.Router();
  
  playPayRouter.get("/users", function(req, res) {
		//Using "all" call as not expecting lot of rows
	    db.all("SELECT name, email_id, balance, email_id AS 'id', created, last_updated FROM user", function(err, rows) {
	        res.json({"users":rows});
	    });
	});
	
  playPayRouter.post("/users", function(req, res) {
		var d=new Date();
		var password_hash=req.body.password; //should really hash instead of storing plain text
		
		if(!req.body.name || !req.body.email_id || !password_hash) {
			res.status(500).send("Missing mandatory parameters- 'name', 'email_id' and 'password' are all needed to create a user record.");

			return;			
		} 
		
		db.run("INSERT INTO user (name, email_id, password_hash, balance, created, last_updated) VALUES (?, ?, ?, ?, ?, ?)", 
			req.body.name, req.body.email_id, password_hash,100,d.getTime(),d.getTime(), 
			function(err) {
				if(err) {
					console.error(err);
					res.status(500).send(err.message);
				} else {
					res.status(200);
				}
		});				
	});


  playPayRouter.get("/users/:email_id", function(req, res) {
		//Using "all" call as not expecting lot of rows
	    db.all("SELECT name, email_id, balance, ROWID as 'id' created, last_updated FROM user WHERE email_id=?", req.params.email_id,function(err, rows) {
	        res.json({"users":rows});
	    });
	});

  playPayRouter.get("/transfers", function(req, res) {
		//Using "all" call as not expecting lot of rows
		db.all("SELECT from_email_id, to_email_id, amount, transfer_date, ROWID as 'id' FROM transfer", function(err, rows) {
			res.json({"transfers":rows});
		});
	});
	
  playPayRouter.post("/transfers", function(req, res) {
		var d=new Date();
	
		if(!req.body.from_email_id || !req.body.to_email_id || !req.body.amount) {
			res.status(500).send("Missing mandatory parameters- 'from_email_id', 'to_email_id' and 'amount' are all needed to initiate a transfer.");
			
			return;
		} 
		if(!(req.body.amount>0)) {
			res.status(500).send("Amount to transfer has to be greater than 0");
			
			return;			
		}
			
		db.serialize(function() {
			db.exec("BEGIN");
			
			db.run("INSERT INTO transfer (from_email_id, to_email_id, amount, transfer_date) VALUES (?, ?, ?, ?)", 
				req.body.from_email_id, req.body.to_email_id, req.body.amount,d.getTime(), 
				function(err) {
					if(err) {					
						console.error(err);
						res.status(500).send(err.message);
						db.exec("ROLLBACK");
					} else {
						db.run("UPDATE user SET balance=balance-?, last_updated=? WHERE email_id=?", 
								req.body.amount,d.getTime(),req.body.from_email_id, 
								function(err) {
									if(err) {					
										console.error(err);
										res.status(500).send(err.message);
										db.exec("ROLLBACK");
									} else {
										db.run("UPDATE user SET balance=balance+?, last_updated=? WHERE email_id=?", 
												req.body.amount,d.getTime(),req.body.to_email_id, 
												function(err) {
													if(err) {					
														console.error(err);
														res.status(500).send(err.message);
														db.exec("ROLLBACK");
													} else {
														db.exec("COMMIT");
														res.status(200);
														res.end();
													}
											});	
										
									}
							});	
						
					}
			});		
						
			
		});
		
	});

  playPayRouter.get("/transfers/:email_id", function(req, res) {
		//Using "all" call as not expecting lot of rows
		db.all("SELECT from_email_id, to_email_id, amount, transfer_date, ROWID FROM transfer WHERE from_email_id=? OR to_email_id=?", req.params.email_id, req.params.email_id, function(err, rows) {
			res.json({"requests":rows});
		});
	});

  
  app.use('/api', playPayRouter);
};
