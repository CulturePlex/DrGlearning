aplic.views.LevelsList = Ext.extend(Ext.Panel, {
	
	items: [{
		xtype: 'list',
		store: aplic.stores.levels,

		itemTpl: 'Level {id}',
		
	}],
	initComponent: function() {
		aplic.stores.levels.load();
		aplic.views.LevelsList.superclass.initComponent.apply(this, arguments);
	}
});