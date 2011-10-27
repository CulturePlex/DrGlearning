/**
 * @class Loan
 * @extends Ext.data.Model
 * The Loan model is the only model we need in this simple application. We're using a custom Proxy for
 * this application to enable us to consume Kiva's JSON api. See lib/KivaProxy.js to see how this is done
 */
Ext.define('DrGlearning.model.Career', {
    extend: 'Ext.data.Model',
    fields: [
	{
		name: "activities",
		type: "string"
	},{
		name: "id",
		type: "int"
	},{
		name: "negative_votes",
		type: "int"
	},{
		name: "positive_votes",
		type: "int"
	},{
		name: "name",
		type: "string"
	},{
		name: "description",
		type: "string"
	},{
		name: "creator",
		type: "string"
	},	{
		name: "resource_uri",
		type: "string"
	},{
		name: "knowledges",
		type: "string"
	},{
		name: "resource_uri",
		type: "string"
	},{
		name: "timestamp",
		type: "string"
	}
	
	],
	proxy: {
		type: 'ajax',
		url : 'careers.json',
		reader: {
			type: 'json',
			root: 'objects',
			
		}
	}
});
