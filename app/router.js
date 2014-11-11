import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('user', { path: 'users/:user_id' }, function() { });
  this.resource('transfer', { path: 'transfers/:transfer_id' }, function() { });
  this.resource('transfers', function() { 
	  
  });
  this.resource('users', function() { 
	  
  });
});

export default Router;
