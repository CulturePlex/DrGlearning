aplic.views.mapView = new Ext.Map({
	title: 'Map',
	getLocation: true,

	marker: null,
	bandera: null,

	mapOptions: {
		styleHtmlContent: true,
		streetViewControl:false,
		zoom: 16,
		centered:true,
		mapTypeId: (typeof(google) != "undefined" && typeof(google.maps) != "undefined" ? google.maps.MapTypeId.SATELLITE : false)

	},
	listeners: {
		delay: 500,
		afterrender: function() {
			
			var pos;
			if(aplic.views.mapaEdit.enedit)
			{
				pos = new google.maps.LatLng( aplic.views.avistamientosEdit.getValues().lugarx, aplic.views.avistamientosEdit.getValues().lugary);
			}else{
				pos = new google.maps.LatLng( aplic.views.avistamientosNew.getValues().lugarx, aplic.views.avistamientosNew.getValues().lugary);
			}
			
			aplic.views.mapView.marker = new google.maps.Marker({
				map: aplic.views.mapView.map,
				position: pos
			});
			this.centrar();
			
		
			/*google.maps.event.addListener(aplic.views.mapView.map, "touchstart", function(e){
				this.marker.map=null;
				console.log('Evento en el mapa touchstart');
				this.marker = new google.maps.Marker({
					map: aplic.views.mapView.map,
					position: e.latLng,
					flat:true
				});
    		
			});*/
			google.maps.event.addListener(aplic.views.mapView.map, "mouseup", function(e){
				
				// ESTO SOLO DEBE EJECUTARSE SI NO SE HA MOVIDO
				
				console.log('Evento en el mapa mousedown');
				if(this.bandera==true)
				{
					aplic.views.mapView.marker.setMap(null);
					
					aplic.views.mapView.marker = new google.maps.Marker({
						map: aplic.views.mapView.map,
						position: e.latLng,
						flat:true
					});
					
					
    			}
			});
			google.maps.event.addListener(aplic.views.mapView.map, "mousemove", function(e){
				console.log('Evento en el mapa mousemove');
				this.bandera=false;
    		
			});
			google.maps.event.addListener(aplic.views.mapView.map, "mousedown", function(e){
				this.bandera=true;
				
    		
			});
		},
		added: function() {
			
		}
	},
	//Metodo para centrar el mapa en el marcador y retaurar valores como zoom, etc..
	centrar: function()
	{
	
			
			var pos1;
			if(aplic.views.mapaEdit.enedit)
			{
				pos1 = new google.maps.LatLng( aplic.views.avistamientosEdit.getValues().lugarx, aplic.views.avistamientosEdit.getValues().lugary);
			}else{
				pos1 = new google.maps.LatLng( aplic.views.avistamientosNew.getValues().lugarx, aplic.views.avistamientosNew.getValues().lugary);
			}
			//
			// Miramos si existe el mapa, porque la primera vez que se renderiza la vista todavía no está instanciado el objeto
			// Llamamos al center desde el afterRendered en ese caso
			if(this.map)
			{
				this.map.setCenter(pos1);
				console.log("centrando a "+pos1.lat()+" y "+pos1.lng()+"porque enedit esta a "+aplic.views.mapaEdit.enedit);
				this.map.setZoom(16);
			}
			
	}

});