import DS from 'ember-data';

export default DS.Model.extend({
	from_email_id: DS.attr(),
	to_email_id: DS.attr(),
	amount: DS.attr('number'),
	transfer_date: DS.attr('date')    
});
