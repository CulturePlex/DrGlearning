Ext.define('DrGlearning.model.Knowledge', {
	extend : 'Ext.data.Model',
	config : {
		fields : [ 
		{
			name : "name",
			type : "string"
		}, {
			name : "resource_uri",
			type : "string"
		}],
		proxy : {
			type : 'localstorage',
			id : 'DrGlearningKnowledgeFields'
		}
	}
});
