aplic.views.AvistamientosSelAve = Ext.extend(Ext.Panel, {
	items: new Ext.List({
	        store: aplic.stores.birds,
	        itemTpl: new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="bicho">',
                 	'<div>',
                       '<div id="listimagen"><img src="img/aves/{imagen}" width="100%"></div>',
                    '</div>',
                    '<div >',
                       '<div id="listarriba">{name}</div>',
                       '<div id="listabajo">{latin}</div>',
                    '</div>',
                '</div>',
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
				
				Ext.dispatch({
				controller: aplic.controllers.avistamientos,
				action: 'aveSeleccionado',
				index: index,
				animation: {
					type:'slide',
					direction:'right'
				}
			});
				
			}

		}
	    }),
	/*items: [{
		xtype: 'list',
		store: aplic.stores.birds,

		itemTpl: '{name}',
		onItemDisclosure: function (record) {
			Ext.dispatch({
				controller: aplic.controllers.avistamientos,
				action: 'aveSeleccionado',
				id: record.getId(),
				animation: {
					type:'slide',
					direction:'right'
				}
			});
		}
	}]*/
	initComponent: function() {
		aplic.stores.birds.load();
		aplic.views.AvistamientosSelAve.superclass.initComponent.apply(this, arguments);
	},
});