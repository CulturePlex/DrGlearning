aplic.views.BirdsFamilies = Ext.extend(Ext.Panel, {
	
	items: [{
		xtype: 'list',
		store: aplic.stores.familias,

		itemTpl: '{nombre}',
		onItemDisclosure: function (record) {
			Ext.dispatch({
				controller: aplic.controllers.birds,
				action: 'showFamily',
				id: record.getId()
			});
		}
	}],
	initComponent: function() {
		aplic.stores.familias.load();
		aplic.views.BirdsList.superclass.initComponent.apply(this, arguments);
	}
});