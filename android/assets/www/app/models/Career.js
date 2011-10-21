aplic.models.Career = Ext.regModel("aplic.models.Career", {
	fields: [
	{
		name: "id" ,
		type: "int"
	},
	{
		name: "name",
		type: "string"
	},{
		name: "resource_uri",
		type: "string"
	},{
		name: "knowledges",
		type: "string"
	},{
		name: "levels",
		type: "string"
	}
	
	],
	proxy: {
		type: 'ajax',
		url : 'jsons/careers.json',
		reader: {
			type: 'json',
			root: 'objects',
			
		}
	}


});

aplic.stores.careers = new Ext.data.Store({
	model: "aplic.models.Career",

});
