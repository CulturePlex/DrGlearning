Ext.define('DrGlearning.model.Career', {
    extend: 'Ext.data.Model',
    config: {
    fields: [
	{
		name: "id",
		type: "string"
	},{
		name: "activities",
		type: "string"
	},{
		name: "negative_votes",
		type: "string"
	},{
		name: "positive_votes",
		type: "string"
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
		type: "auto"
	},{
		name: "timestamp",
		type: "string"
	},{
		name: "installed",
		type: "string"
	},{
		name: "started",
		type: "string"
	},{
		name: "update",
		type: "boolean"
	}],
   proxy: {
		type: 'localstorage',
		id  : 'DrGlearningCareers'
	}
    }
});
