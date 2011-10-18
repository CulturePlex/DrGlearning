aplic.views.AvistamientosList = Ext.extend(Ext.Panel, {
	dockedItems: [{
		xtype: 'toolbar',
		title: 'Mis Avistamientos',
		items: [{
			xtype: 'selectfield',
			name:'nombre',
			options:[{
				text:'especie',
				value:'especie'

			},{
				text:'lugar',
				value:'lugar'
			},{
				text:'fecha',
				value:'fecha'
			}
			],
			listeners: {
				change: {
					fn: function() {
						if(this.value == "especie") {
							Ext.dispatch({
								controller: aplic.controllers.avistamientos,
								action: 'ordenarpor',
								valor: 'especie',

							});
						} 
						if(this.value == "lugar") {
							Ext.dispatch({
								controller: aplic.controllers.avistamientos,
								action: 'ordenarpor',
								valor: 'lugar',

							});
						}
						if(this.value == "fecha") {
							Ext.dispatch({
								controller: aplic.controllers.avistamientos,
								action: 'ordenarpor',
								valor: 'fecha',

							});
						}
						
					}
				}
			},
			width:110
		},{
			xtype: 'spacer'
		},{
			text: '+',
			ui:'round',
			xtype:'button',
			listeners: {
				'tap': function () {
					Ext.dispatch({
						controller: aplic.controllers.avistamientos,
						action: 'nuevo',
						animation: {
							type:'slide',
							direction:'left'
						},

					});
				}
			}

		}

		]
	}],

	items: new Ext.jep.List({
		store: aplic.stores.avistamientos,
		itemTpl: new Ext.XTemplate(
		'<tpl for=".">',
		'<div class="avistamiento">',
		'<div>',
		'<div id="listimagen"><img src="img/aves/{imagenAve}" width="100%"></div>',
		'</div>',
		'<div >',
		'<tpl if="aplic.views.avistamientosList.orden == 0">',
		'<div id="listarriba">{nombreAveLatin}</div>',
		'</tpl>',
		'<tpl if="aplic.views.avistamientosList.orden == 1">',
		'<div id="listarriba">{lugar}</div>',
		'</tpl>',
		'<tpl if="aplic.views.avistamientosList.orden == 2">',
		'<div id="listarriba">{[values.fecha.format("j F, Y, g:i a")]}</div>',
		'</tpl>',
		'<tpl if="aplic.views.avistamientosList.orden == 0">',
		'<div id="listabajo">{lugar} {[values.fecha.format("j F, Y, g:i a")]}</div>',
		'</tpl>',
		'<tpl if="aplic.views.avistamientosList.orden == 1">',
		'<div id="listabajo">{nombreAveLatin} {[values.fecha.format("j F, Y, g:i a")]}</div>',
		'</tpl>',
		'<tpl if="aplic.views.avistamientosList.orden == 2">',
		'<div id="listabajo">{nombreAveLatin} </div>',
		'</tpl>',
		'</div>',
		'</div>',
		'</tpl>'
		),
		// autoHeight:true,
		height:"100%",
		// multiSelect: true,
		grouped:true,
		indexBar:true,
		overItemCls:'x-view-over',
		itemSelector:'div.avistamiento',
		emptyText: 'No hay avistamientos',
		listeners: {
			'itemTap': function(dataview, index, item, evt) {
				console.log(index);
				Ext.dispatch({
					controller: aplic.controllers.avistamientos,
					action: 'show',

					record : aplic.stores.avistamientos.getAt(index)
				});

			}
		}
	}),

	initComponent: function() {
		aplic.stores.avistamientos.load();
		aplic.views.AvistamientosList.superclass.initComponent.apply(this, arguments);

	},
	updateWithId: function(id) {

	},
	orden:0
});