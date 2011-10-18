aplic.views.AvistamientoDetailMarco = Ext.extend(Ext.Panel, {
	dockedItems: [{
		/*listeners: {
			body: {
				//delegate: '#as', //bind to the underlying el property on the panel
				tap: function(e) {
					if(e.target.id=='botonatras') {
						Ext.dispatch({
						controller: aplic.controllers.avistamientos,
						action: 'index',
						animation: {
							type:'slide',
							direction:'right'
						}
					});
					}
					if(e.target.id=='borrar') {
						Ext.dispatch({
							controller: aplic.controllers.avistamientos,
							action: 'borrar',
							animation: {
								type:'slide',
								direction:'left'
							}
						});
					}
					console.log(e);
					
				}
			}
		},*/
		xtype: 'toolbar',
		//baseCls:"barraavistadetail",
		//height:'67',
		//html:"<div id='botonatras' >&nbsp;</div> <div id='titulobarra'>Avistamientos</div> <div id='botonanterior'>&nbsp;</div> <div id='botonsiguiente'>&nbsp;</div>",
		items: [{
			text: 'Atrás',
			ui: 'back',
			listeners: {
				'tap': function () {
					Ext.dispatch({
						controller: aplic.controllers.avistamientos,
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
						controller: aplic.controllers.avistamientos,
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
						controller: aplic.controllers.avistamientos,
						action: 'sig',
						animation: {
							type:'slide',
							direction:'left'
						}
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

			avistamientoDetail: new aplic.views.AvistamientoDetail(),
			avistamientoDetailOdd: new aplic.views.AvistamientoDetail(),

		});

		//put instances of cards into viewport
		Ext.apply(this, {
			items: [

			aplic.views.avistamientoDetail,
			aplic.views.avistamientoDetailOdd,

			]
		});
		console.log('Dentro de Marco: ' + aplic.views);
		aplic.views.AvistamientoDetailMarco.superclass.initComponent.apply(this, arguments);
	}
});