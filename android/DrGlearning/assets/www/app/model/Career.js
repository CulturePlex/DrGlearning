Ext.define('DrGlearning.model.Career', {
	extend : 'Ext.data.Model',
	config : {
		fields : [ {
			name : "id",
			type : "string"
		}, {
			name : "activities",
			type : "auto"
		}, {
			name : "negative_votes",
			type : "string"
		}, {
			name : "positive_votes",
			type : "string"
		}, {
			name : "name",
			type : "string"
		}, {
			name : "description",
			type : "string"
		}, {
			name : "creator",
			type : "string"
		}, {
			name : "resource_uri",
			type : "string"
		}, {
			name : "knowledges",
			type : "auto"
		}, {
			name : "timestamp",
			type : "string"
		}, {
			name : "installed",
			type : "boolean"
		}, {
			name : "started",
			type : "boolean"
		}, {
			name : "update",
			type : "boolean"
		},{
			name : "size",
			type : "int"
		}],
		proxy : {
			type : 'localstorage',
			id : 'DrGlearningCareers'
		}
	}
});
