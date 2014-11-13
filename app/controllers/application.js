import Ember from 'ember';

export default Ember.ObjectController.extend({
	disableUserFeatures: Ember.computed('session.isAuthenticated', function() {
		var session=this.get("session");
		return !(session.isAuthenticated);
	}),
	disableAdminFeatures: Ember.computed('session.isAuthenticated', function() {
		var session=this.get("session");
		return !(session.isAuthenticated && session.content.user_type=="admin");
	})

});
