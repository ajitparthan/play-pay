import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		return this.store.findQuery('transfer',{email_id: params.user_id});
	}

});
