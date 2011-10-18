aplic.views.BirdsList = Ext.extend(Ext.Panel, {
	items: new Ext.List({
	        store: aplic.stores.birds,
	        itemTpl: new Ext.XTemplate(
                '<tpl for=".">',
               
                    '<div id="listimagen"><img src="img/aves/mini{imagen}" width="100%"></div>',
                	'<tpl if="aplic.views.birdsList.orden == 0">',
                   		'<div id="listarriba">{name}</div>',
                    '</tpl>',
                    '<tpl if="aplic.views.birdsList.orden == 1">',
                   		'<div id="listarriba">{latin}</div>',
                    '</tpl>',
                    '<tpl if="aplic.views.birdsList.orden == 0">',
                    	'<div id="listabajo">{latin}</div>',
                    '</tpl>',
                    '<tpl if="aplic.views.birdsList.orden == 1">',
                   		'<div id="listabajo">{name}</div>',
                    '</tpl>',
               
                '</tpl>'
            ),
            grouped:true,
            indexBar:true,
            autoHeight:true,
	        height:"100%",
	        overItemCls:'x-view-over',
	        itemSelector:'div.bicho',
	        emptyText: 'No hay aves',
	        listeners: {
			'itemTap':function(dataview, index, item, evt) {
				console.log(index);
				Ext.dispatch({
				controller: aplic.controllers.birds,
				action: 'show',
				id: index,
				record : aplic.stores.birds.getAt(index)
			});
				
			}

		}
	    }),

	initComponent: function() {
		aplic.stores.birds.load();
		aplic.views.BirdsList.superclass.initComponent.apply(this, arguments);
	},
	updateWithId: function(id) {

	},
	orden:0
	
	
});