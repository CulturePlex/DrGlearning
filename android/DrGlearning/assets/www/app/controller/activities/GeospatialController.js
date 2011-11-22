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
                map.panTo(new google.maps.LatLng(50.71462, 12.496889));
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
		                radius: 0+activity.data.radius,
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
