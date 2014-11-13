var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var sqlite3=require('sqlite3').verbose();
var dbFile = "/tmp/playpay.sqlite3";

var db = new sqlite3.Database(dbFile);

describe('Routing', function() {
  var url = 'http://localhost:4200';
  
  before(function(done) {
     done();
  });
  
  describe('POST /api/users', function() {
	  it('should successfuly create new user', function(done) {
		  var user = {
				  name: 'test1',
				  password: 'password',
				  email_id: 'test1@domain.com'
		  };

		  request(url)
		  .post('/api/users')
		  .send({user:user})
		  .end(function(err, res) {
			  if (err) {
				  throw err;
			  }
			  res.should.be.json;
			  res.status.should.equal(200);
			  
			  //cleanup
			  db.run("DELETE FROM user WHERE email_id=?",user.email_id);

			  done();
		  });
	  });
	  
	  it('should fail to create new user as no password', function(done) {
		  var user = {
				  name: 'test2',
				  email_id: 'test1@domain.com'
		  };

		  request(url)
		  .post('/api/users')
		  .send({user:user})
		  .end(function(err, res) {
			  if (err) {
				  throw err;
			  }
			  res.should.be.json;
			  res.status.should.equal(422);

			  done();
		  });
	  });
	  it('should fail to create new user as no email', function(done) {
		  var user = {
				  name: 'test2',
				  password: 'dddddd'
		  };

		  request(url)
		  .post('/api/users')
		  .send({user:user})
		  .end(function(err, res) {
			  if (err) {
				  throw err;
			  }
			  res.should.be.json;
			  res.status.should.equal(422);

			  done();
		  });
	  });
	  it('should fail to create as duplicate', function(done) {
		  var user = {
				  name: 'test4',
				  password: 'dddddd',
					  email_id: "test3@domain.com"
		  };
		  request(url)
		  .post('/api/users')
		  .send({user:user}).end(function(err,res) {});
		  
		  request(url)
		  .post('/api/users')
		  .send({user:user})
		  .end(function(err, res) {
			  if (err) {
				  throw err;
			  }
			  res.should.be.json;
			  res.status.should.equal(422);
			  
			  db.run("DELETE FROM user WHERE email_id=?",user.email_id);
			  
			  done();
		  });
	  });


  });
  describe('GET /api/users/:user_id', function() {
	  var url = 'http://localhost:4200';
	  var token;
	  
	  before(function(done) {
	     done();
	  });

	  var user = {
			  name: 'test11',
			  password: 'password',
			  email_id: 'test11@domain.com'
	  };
	  request(url)
	  .post('/api/users')
	  .send({user:user}).end(function(err,res) {});

	  it('should fails as not authenticated', function(done) {
		  request(url)
		  .get('/api/users/test11')
		  .send({user:user})
		  .end(function(err, res) {
			  if (err) {
				  throw err;
			  }
			  res.should.be.json;
			  res.status.should.equal(401);

			  done();
		  });
	  });
	  
	  it('should fails as incorrect password for authentication', function(done) {
		  request(url)
		  .get('/api-token-auth')
		  .send({username:user.email_id, password:user.password+"Q"})
		  .end(function(err, res) {
			  if (err) {
				  throw err;
			  }
			  res.should.be.json;
			  res.status.should.equal(404);

			  done();
		  });
	  });
	  
	  it('should successfully authenticate', function(done) {
		  request(url)
		  .post('/api-token-auth')
		  .send({username:user.email_id, password:user.password})
		  .end(function(err, res) {
			  if (err) {
				  throw err;
			  }
			  res.should.be.json;
			  res.status.should.equal(200);
			  
			  token=res.body.token;
			  done();
		  });
	  });

	  it('should successfully get user '+user.email_id, function(done) {
		  request(url)
		  .get('/api/users/'+user.email_id)
		  .set("Authorization","Bearer "+token)
		  .end(function(err, res) {
			  if (err) {
				  throw err;
			  }
			  res.should.be.json;
			  res.status.should.equal(200);
			  res.body.user.email_id.should.equal(user.email_id);
			  done();
		  });
	  });

	  it('should not be able to get anyother user ', function(done) {
		  request(url)
		  .get('/api/users/testuser')
		  .set("Authorization","Bearer "+token)
		  .end(function(err, res) {
			  if (err) {
				  throw err;
			  }
			  res.should.be.json;
			  res.status.should.equal(403);
			  done();
		  });
	  });


	  
	  //cleanup
	  db.run("DELETE FROM user WHERE email_id=?",user.email_id);
	  

  });
});