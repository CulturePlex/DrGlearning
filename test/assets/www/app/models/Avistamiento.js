aplic.models.Avistamiento = Ext.regModel("aplic.models.Avistamiento", {
	fields: [{
		name: "id",
		type: "int"
	},{
		name: "nombreAve",
		type: "string"
	},{
		name: "imagenAve",
		type: "string"
	},{
		name: "nombreAveLatin",
		type: "string"
	},{
		name: "descripcion",
		type: "string"
	},{
		name: "fecha",
		type: "date",
		dateFormat: "c",			
	},{
		name: "lugar",
		type: "string"
	},{
		name: "lugarx",
		type: "double"
	},{
		name: "lugary",
		type: "double"
	},{
		name: "idAve" ,
		type: "int"
	},{
		name: "conteo",
		type: "int"
	}
	],
	proxy: new Ext.data.LocalStorageProxy({
		id: 'avistamientos'
	}),
	
	validations: [{
		type: 'presence',
		name: 'nombreAve',
		message:"Seleccione el tipo de Ave"
	},{
		type: 'presence',
		name: 'fecha',
		message:"Seleccione la fecha/hora"
	}

	],
	clearOnPageLoad: true
});

aplic.stores.avistamientos = new Ext.data.Store({
	model: "aplic.models.Avistamiento",
	sorters:[{property:'nombreAveLatin',direction:"ASC"}],
	groupingString : "nombreAveLatin",
	getGroupString : function(record) {
		return record.get(this.groupingString)[0];
	},
	setGroupingString : function(groupingString)
	{
		this.groupingString = groupingString;
	}
	

});