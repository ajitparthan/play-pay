import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr(),
	email_id: DS.attr(),
	account_id: DS.attr(),
	password: DS.attr(),
	balance: DS.attr('number'),
	created: DS.attr('date'),
	last_updated: DS.attr('date')  
});
