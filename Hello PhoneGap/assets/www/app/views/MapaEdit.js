aplic.views.MapaEdit = Ext.extend(Ext.Panel, {
	/*listeners: {
	 body: {
	 //delegate: '#as', //bind to the underlying el property on the panel
	 tap: function(e){
	 console.log(e);

	 }

	 }},*/
	enedit:null,
	dockedItems: [{
		xtype: 'toolbar',
		title: 'Editar Lugar',
		items: [{
			id: 'cancel',
			text: 'Cancel',
			ui: 'back',
			listeners: {
				'tap': function () {
					Ext.dispatch({
						controller: aplic.controllers.avistamientos,
						action: 'salirmapa',
						animation: {
							type:'slide',
							direction:'right'
						}
					});
				}
			}
		},{
			xtype:'spacer'
		},{
			id: 'salvarmapa',
			text: 'Guardar',
			ui: 'action',
			listeners: {
				'tap': function () {
					Ext.dispatch({
						controller: aplic.controllers.avistamientos,
						action: 'salvarmapa',
						animation: {
							type:'slide',
							direction:'right'
						}
					});
				}
			}
		}
		]
	}],

	items:

	[aplic.views.mapView]
	,

	updateWithRecord: function(data) {
		
		
		
	},
	initComponent: function() {

		aplic.views.MapaEdit.superclass.initComponent.apply(this, arguments);

	},
	anadeMarcador: function(latitud,longitud) {

		var pos = new google.maps.LatLng(latitud,longitud);
		var marker = new google.maps.Marker({
			position:  pos,
			map: aplic.views.mapView.map
		});
	}
});