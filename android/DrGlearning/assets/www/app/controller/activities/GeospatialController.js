Ext.define('DrGlearning.controller.activities.GeospatialController', {
    extend: 'Ext.app.Controller',
    requires: ['DrGlearning.store.Careers','DrGlearning.store.Levels','DrGlearning.view.CareersFrame'],
    views: ['ActivityFrame', 'activities.Geospatial'],
	controllers: ['DrGlearning.controller.Careers'],
    stores: ['Careers','Levels','Activities'],
	refs: [{
        ref: 'activities.geospatial',
        selector: 'mainview',
        autoCreate: true,
        xtype: 'mainview'
    }],	
	updateActivity: function(view,newActivity) {
		view.down('component[id=activity]').destroy();
		activityView = Ext.create('DrGlearning.view.activities.Geospatial');
		activityView.down('label').setHtml(newActivity.data.query);
		console.log(newActivity);
		this.initialize(activityView,newActivity);
		view.add(activityView);
		
		
	},
	initialize: function(view,activity) {
        var map = view.down('map').getMap();
		// FIX: Rendering Problem von Sencha Touch 2.0.0-pr1
        view.on({
            show: function(){
                google.maps.event.trigger(map, 'resize');
                
				//var elotro={"type":"Feature", "properties":{}, "geometry":{"type":"Polygon", "coordinates":[[[20.390625, 13.0078125], [48.515625, 1.0546875], [33.75, 18.6328125], [9.84375, 28.4765625], [11.25, 1.7578125], [22.5, 12.3046875], [20.390625, 13.0078125]]]}, "crs":{"type":"name", "properties":{"name":"urn:ogc:def:crs:OGC:1.3:CRS84"}}};
				var jsonfromserver=eval("(" + activity.data.area + ')');
				var googleOptions = {
				    strokeColor: "#FFFF00",
				    strokeWeight: 7,
				    strokeOpacity: 0.75
				};
				//var multipunto1={"type":"Feature", "properties":{}, "geometry":{"type":"Point", "coordinates":[37.265625, -16.5234375]}, "crs":{"type":"name", "properties":{"name":"urn:ogc:def:crs:OGC:1.3:CRS84"}}};
				var multipunto=eval("(" + activity.data.point + ')');
				var googlePuntos=new GeoJSON(multipunto, googleOptions);
				
				//console.log(multipunto);
				//googlePuntos.setMap(map);
			
				googleVector = new GeoJSON(jsonfromserver, googleOptions);
				googleVector.setMap(map);
				map.panTo(new google.maps.LatLng(googlePuntos[0].position.Pa, googlePuntos[0].position.Qa));
				map.setZoom(5);
            }
        });
        // FIX: Rendering Problem von Sencha Touch 2.0.0-pr1
		//starting parameters...
		/*view.poligono = new google.maps.Polygon({
						map:map,
						latlngs: activity.data.area,
					});
					console.log(activity);
		view.solucion = new google.maps.Marker({
						map: map,
						position: activity.data.point,
						flat: true,
					});
		*/
		//Creando eventlisteners para colocar marker y circulo al pinchar
		google.maps.event.addListener(map, "mouseup", function(e){
				// ESTO SOLO DEBE EJECUTARSE SI NO SE HA MOVIDO, BANDERA nos indica si se ha movido el cursor mientras movíamos o no.
				if (view.bandera == true) {
					//console.log('Evento en el mapa mousedown');
					if (view.marker) {
						view.marker.setMap(null);
					}
					if (view.circle) {
						view.circle.setMap(null);
					}
					
					view.circle = new google.maps.Circle({
		                center: e.latLng,
		                radius: parseFloat(activity.data.radius),
		                map: map,
						clickable:false
		            });
					view.marker = new google.maps.Marker({
						map: map,
						position: e.latLng,
						flat: true
					});
				}
		});
		google.maps.event.addListener(map, "mousemove", function(e){
				view.bandera=false;
		});
		google.maps.event.addListener(map, "mousedown", function(e){
				view.bandera=true;
		});
			
    }
});
