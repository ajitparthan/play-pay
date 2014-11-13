import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		return this.store.find('user',params.user_id);
	},
	actions: {
		makeTransfer: function() {
			var controller=this.controller;
			var model=this.currentModel;
			var route=this;
		
			var transfer=this.store.createRecord("transfer",{to_email_id: controller.get("to_email_id"), 
													amount: controller.get("amount"),
													from_email_id: model.get('email_id')});
			transfer.save().then(function() {
				controller.set("makeTransferError",null);
				route.transitionTo("mytransfers",model.get('email_id'));
			}, function(err) {
				controller.set("makeTransferError",err);
			});
		}
	}

});
