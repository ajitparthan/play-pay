import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('user', { path: 'users/:user_id' }, function() {});
  this.resource('transfer', { path: 'transfers/:transfer_id' }, function() { });
  this.resource('transfers', function() {});
  this.resource('users', function() {});
  
  this.route('login');
  this.route('user/new', {path:'users/new'}, function() {});
  this.route('mytransfers', {path: 'users/:user_id/mytransfers'}, function() {});

  this.route('maketransfer', {path: 'users/:user_id/maketransfer'}, function() {});
});

export default Router;
