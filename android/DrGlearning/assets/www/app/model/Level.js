/**
 * @class Loan
 * @extends Ext.data.Model
 * The Loan model is the only model we need in this simple application. We're using a custom Proxy for
 * this application to enable us to consume Kiva's JSON api. See lib/KivaProxy.js to see how this is done
 */
Ext.define('DrGlearning.model.Level', {
    extend: 'Ext.data.Model',
    fields: [
	{
		name: "customId",
		type: "string"
	},{
		name: "name",
		type: "string"
	},{
		name: "description",
		type: "string"
	}],
   proxy: {
		type: 'ajax',
		url : 'resources/json/levels.json',
		reader: {
			type: 'json',
			root: 'levels'
		}
	}
});
