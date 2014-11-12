import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('user', { path: 'users/:user_id' }, function() { 
	  this.route('transfers',{ path: 'transfers/'}, function() {
		  
	  });	
	  this.route('transfers/new', { path: 'users/:user_id/transfers/new'}, function() {
		  
	  });

  });
  this.resource('transfer', { path: 'transfers/:transfer_id' }, function() { });
  this.resource('transfers', function() { 
	  
  });
  this.resource('users', function() { 
	  
  });
  
  this.route('login');
  this.route('user/new', {path:'users/new'}, function() {
	  
  });

});

export default Router;
