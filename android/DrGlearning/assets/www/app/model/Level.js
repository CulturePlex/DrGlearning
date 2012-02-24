Ext.define('DrGlearning.model.Level', {
	extend : 'Ext.data.Model',
	config : {
		fields : [ {
			name : "customId",
			type : "string"
		}, {
			name : "name",
			type : "string"
		}, {
			name : "description",
			type : "string"
		} ],
		proxy : {
			type : 'ajax',
			url : 'resources/json/levels.json',
			reader : {
				type : 'json',
				root : 'levels'
			}
		}
	}
});
