aplic.views.CareersList = Ext.extend(Ext.Panel, {
	
	items: [{
		xtype: 'list',
		store: aplic.stores.careers,

		itemTpl: '{name}',
		onItemDisclosure: function (record) {
			Ext.dispatch({
				controller: aplic.controllers.careers,
				action: 'show',
				id: record.getId(),
				career: record
			});
		}
	}],
	initComponent: function() {
		aplic.stores.careers.load();
		aplic.views.CareersList.superclass.initComponent.apply(this, arguments);
	}
});