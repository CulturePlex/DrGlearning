aplic.models.Level = Ext.regModel("aplic.models.Level", {
	fields: [
	{
		name: "id" ,
		type: "int"
	},
	{
		name: "activity",
		type: "string"
	},{
		name: "order",
		type: "string"
	},{
		name: "required",
		type: "string"
	},{
		name: "resource_uri",
		type: "string"
	},{
		name: "type",
		type: "int"
	}
	
	],
	proxy: {
		type: 'ajax',
		url : 'jsons/levels.json',
		reader: {
			type: 'json',
			root: 'objects',
			
		}
	}


});

aplic.stores.levels = new Ext.data.Store({
	model: "aplic.models.Level",

});
