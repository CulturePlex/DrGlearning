aplic.models.Familia = Ext.regModel("aplic.models.Familia", {
	fields: [{
		name: "nombre",
		type: "string"
	},{
		name: "descripcion",
		type: "string"
	},{
		name: "id" ,
		type: "int"
	}
	],
	proxy: {
		type: 'ajax',
		url : 'data.xml',
		reader: {
			type: 'xml',
			record: 'familia'
		}
	}
});

aplic.stores.familias = new Ext.data.Store({
	model: "aplic.models.Familia",

});