aplic.views.BirdsMarco = Ext.extend(Ext.Panel, {
	dockedItems: [{
		xtype: 'toolbar',
		items: [{
			xtype: 'segmentedbutton',
			allowDepress: false,
			items: [{
				text: 'Familias',
				ui: 'dark',
				listeners: {
					'tap': function () {
						Ext.dispatch({
							controller: aplic.controllers.birds,
							action: 'familias',
							animation: {
								type:'slide',
								direction:'left'
							}
						});
					}
				}

			},{
				text: 'Listado',
				pressed: true,
				ui: 'dark',
				listeners: {
					'tap': function () {
						Ext.dispatch({
							controller: aplic.controllers.birds,
							action: 'index',
							fam: 0,
							animation: {
								type:'slide',
								direction:'right'
							}
						});
					}
				}

			}

			]
		},{
			xtype: 'selectfield',
			name:'nombre',
			options:[{
				text:'común',
				value:'comun'
			},{
				text:'científico',
				value:'cientifico',
			}],
			listeners: {
				change: {
					fn: function() {
						if(this.value == "comun")
						{
							Ext.dispatch({
								controller: aplic.controllers.birds,
								action: 'ordenarpor',
								valor: 'comun',
								animation: {
									type:'slide',
									direction:'right',
									
								}
							});
						}
						else
						{
							Ext.dispatch({
								controller: aplic.controllers.birds,
								action: 'ordenarpor',
								valor: 'cientifico',
								animation: {
									type:'slide',
									direction:'right',
									
								}
							});
						}
					}
				}
			},
			width:170

		}

		]
	},{
		xtype: 'toolbar',
		dock: 'bottom',
		items: [{
			xtype: 'searchfield',
			placeHolder: ' palabra clave, nombre común o científico',
			name: 'searchfield',
			width: '95%',
			id: 'barrabusqueda',

			listeners: {
				'keyup': function (thisField,e) {
					if(e.browserEvent.keyCode!=13) {
						Ext.dispatch({
							controller: aplic.controllers.birds,
							action: 'busca',
							animation: {
								type:'slide',
								direction:'left'
							},
							cadena: this.getValue().toLowerCase(),
						});
					}
				}
			}

		}]
	}],
	layout: 'card',

	cardSwitchAnimation: 'slide',
	initComponent: function() {
		//put instances of cards into app.views namespace
		Ext.apply(aplic.views, {
			birdsList: new aplic.views.BirdsList(),
			birdsFamilies: new aplic.views.BirdsFamilies()

		});

		//put instances of cards into viewport
		Ext.apply(this, {
			items: [

			aplic.views.birdsList,
			aplic.views.birdsFamilies

			]
		});
		console.log('Dentro de Marco: ' + aplic.views);
		aplic.views.BirdsMarco.superclass.initComponent.apply(this, arguments);
	},
	limpiabusqueda: function() {
		this.getDockedItems()[1].items.items[0].reset();
		//barrabusqueda.reset();

	}
});