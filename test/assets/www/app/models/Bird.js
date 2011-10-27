aplic.models.Bird = Ext.regModel("aplic.models.Bird", {
	fields: [{
		name: "name",
		type: "string"
	},{
		name: "latin",
		type: "string"
	},{
		name: "idFamilia",
		type: "int"
	},{
		name: "imagen",
		type: "string"
	},{
		name: "texto",
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
			record: 'bird'
		}
	},
	clearOnPageLoad: true

});

aplic.stores.birds = new Ext.data.Store({
	model: "aplic.models.Bird",
	sorters:[{property:'name',direction:"ASC"}],
	groupingString : "name",
	getGroupString : function(record) {
		return record.get(this.groupingString)[0];
	},
	setGroupingString : function(groupingString)
	{
		this.groupingString = groupingString;
	}

});