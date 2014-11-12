import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		createAccount: function() {
			var controller=this.controller;
			var route=this;
		
			var user=this.store.createRecord("user",{email_id: controller.get("email_id"), 
													name: controller.get("name"),
													password: controller.get("password")});
			user.save().then(function() {
				controller.set("createAccountError",null);
				route.transitionTo("login");
			}, function(err) {
				controller.set("createAccountError",err);
			});
		}
	}
});
