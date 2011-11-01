aplic.views.Viewport = Ext.extend(Ext.Panel, {
	dockedItems: [{
		dock : 'top',
		xtype: 'toolbar',
		html:"SEO BIRD AVES DE DOÑANA",
		baseCls:"barraseo",
		height:'29'

	},{
		dock : 'bottom',
		xtype: 'toolbar',
		title: '',
		items: [{

			xtype: 'segmentedbutton',
			allowDepress: false,
			items: [{
				text: 'Buscar',
				pressed: true,
				listeners: {
					'tap': function () {
						Ext.dispatch({
							controller: aplic.controllers.birds,
							action: 'index',
							animation: {
								type:'slide',
								direction:'right'
							},
							animation1: {},
							animation2: {}
						});
					}
				}

			},{
				text: 'Avist.',
				ui: 'dark',
				listeners: {
					'tap': function () {

						Ext.dispatch({
							controller: aplic.controllers.avistamientos,
							action: 'index',
							animation: {
								type:'slide',
								direction:'left'
							}
						});
					}
				}

			}

			]

		}

		]

	}
	],
	fullscreen: true,
	layout: 'card',

	cardSwitchAnimation: 'slide',
	initComponent: function() {
		//put instances of cards into app.views namespace
		Ext.apply(aplic.views, {
			birdsView: new aplic.views.BirdsView(),
			avistamientosView: new aplic.views.AvistamientosView()
		});

		//put instances of cards into viewport
		Ext.apply(this, {
			items: [
			aplic.views.birdsView,
			aplic.views.avistamientosView
			]
		});
		console.log('Dentro de viewPort : ' + aplic.views);
		aplic.views.Viewport.superclass.initComponent.apply(this, arguments);

	}
});