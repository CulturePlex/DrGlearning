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
	elmarker:null,
	elpunto:null,
	radio:null,
	initialize: function(view,activity) {
		this.control({
			'button[customId=confirm]': {
				tap: this.confirm
			}
		});
		
        var map = view.down('map').getMap();
		// FIX: Rendering Problem von Sencha Touch 2.0.0-pr1
        view.on({
            show: function(){
                google.maps.event.trigger(map, 'resize');
                
				//var elotro={"type":"Feature", "properties":{}, "geometry":{"type":"Polygon", "coordinates":[[[20.390625, 13.0078125], [48.515625, 1.0546875], [33.75, 18.6328125], [9.84375, 28.4765625], [11.25, 1.7578125], [22.5, 12.3046875], [20.390625, 13.0078125]]]}, "crs":{"type":"name", "properties":{"name":"urn:ogc:def:crs:OGC:1.3:CRS84"}}};
				var jsonfromserver=eval("(" + activity.data.area + ')');
				var googleOptions = {
				    strokeColor: "#00FFFF",
				    strokeWeight: 0,
				    strokeOpacity: 0.5,
					fillOpacity: 0.2,
					fillColor: "#6699ff",
					clickable:false
				};
				//var multipunto1={"type":"Feature", "properties":{}, "geometry":{"type":"Point", "coordinates":[37.265625, -16.5234375]}, "crs":{"type":"name", "properties":{"name":"urn:ogc:def:crs:OGC:1.3:CRS84"}}};
				var multipunto=eval("(" + activity.data.point + ')');
				
				var googlePuntos=new GeoJSON(multipunto, googleOptions);
				console.log(googlePuntos[0].position.Pa);
				elpunto=new google.maps.LatLng(googlePuntos[0].position.Pa,googlePuntos[0].position.Qa);
				console.log(elpunto);
				//googlePuntos.color="#FF0000"
				//console.log(googlePuntos);	
				//console.log(multipunto);
				//googlePuntos.setMap(map);
			
				googleVector = new GeoJSON(jsonfromserver, googleOptions);
				googleVector.color="#FFOOOO";
				googleVector.setMap(map);
				 //console.log(bounds.getCenter());
				//googleVector.getBounds();				
					map.panTo(new google.maps.LatLng(googlePuntos[0].position.Pa, googlePuntos[0].position.Qa));
					map.setZoom(3);
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
		radio=parseFloat(activity.data.radius);
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
					elmarker=view.marker;
					
				}
		});
		google.maps.event.addListener(map, "mousemove", function(e){
				view.bandera=false;
		});
		google.maps.event.addListener(map, "mousedown", function(e){
				view.bandera=true;
		});
			
    },
	confirm: function() {
		console.log(elmarker);
		console.log(elpunto);
		var distancia=Math.sqrt(Math.pow(elmarker.position.Pa-elpunto.Pa,2)+Math.pow(elmarker.position.Qa-elpunto.Qa,2))*60000;
		console.log(distancia);
		console.log(radio);
		if (distancia < radio) {
			Ext.Msg.alert('Right!', 'it was the correct answer!', function(){
				this.getController('Careers').tolevel();
			}, this);
		}else{
			Ext.Msg.alert('Wrong!', 'Oooh, it wasnt the correct answer', function(){
				this.getController('Careers').tolevel();
			}, this);
		}
			
	}
});
