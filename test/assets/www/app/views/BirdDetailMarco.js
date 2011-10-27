aplic.views.BirdDetailMarco = Ext.extend(Ext.Panel, {
	dockedItems: [{
		xtype: 'toolbar',

		items: [{
			text: 'Atrás',
			ui: 'back',
			listeners: {
				'tap': function () {
					Ext.dispatch({
						controller: aplic.controllers.birds,
						action: 'index',
						animation: {
							type:'slide',
							direction:'right'
						}
					});
				}
			}
		},{
			text: 'Anterior',
			ui: 'back',
			listeners: {
				'tap': function () {
					Ext.dispatch({
						controller: aplic.controllers.birds,
						action: 'ant',
						animation: {
							type:'slide',
							direction:'right'
						}
					});
				}
			}

		},{
			text: 'Siguiente',
			ui: 'forward',
			listeners: {
				'tap': function () {
					Ext.dispatch({
						controller: aplic.controllers.birds,
						action: 'sig',
						animation: {
							type:'slide',
							direction:'left'
						}
					});
				}
			}

		},{
			text: 'N. Avist.',
			ui: 'dark',
			listeners: {
				'tap': function () {
					Ext.dispatch({
						controller: aplic.controllers.avistamientos,
						action: 'nuevocontipo',
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
	layout: 'card',

	cardSwitchAnimation: 'slide',
	initComponent: function() {
		//put instances of cards into app.views namespace
		Ext.apply(aplic.views, {

			birdDetail: new aplic.views.BirdDetail(),
			birdDetailOdd: new aplic.views.BirdDetail(),

		});

		//put instances of cards into viewport
		Ext.apply(this, {
			items: [

			aplic.views.birdDetail,
			aplic.views.birdDetailOdd,

			]
		});
		console.log('Dentro de Marco: ' + aplic.views);
		aplic.views.BirdDetailMarco.superclass.initComponent.apply(this, arguments);
	}
});