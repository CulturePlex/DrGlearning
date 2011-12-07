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
	elmarker:null,
	elpunto:null,
	radio:null,
	activity:null,
	activityView:null,
	initializate: function(){
		this.control({
			'button[customId=confirm]': {
				tap: this.confirm
			}
		});
	},
	updateActivity: function(view,newActivity) {
		this.activityView=null;
		this.elmarker=null;
		this.elpunto=null;
		this.radio=null;
		this.activity=null;
		//console.log(view.down('component[customId=activity]'));
		view.down('component[customId=activity]').hide();
		view.down('component[customId=activity]').destroy();
		this.activityView = Ext.create('DrGlearning.view.activities.Geospatial');
		this.activityView.down('label').setHtml(newActivity.data.query);
		this.empezar(this.activityView,newActivity);
		view.add(this.activityView);
	},
		empezar: function(view,activity) {
		this.activity=activity;
		console.log('dale');
        var map = view.down('map').getMap();
		// FIX: Rendering Problem von Sencha Touch 2.0.0-pr1
        view.on({
            show: function(){
                google.maps.event.trigger(map, 'resize');
				var jsonfromserver=eval("(" + activity.data.area + ')');
				var googleOptions = {
				    strokeColor: "#00FFFF",
				    strokeWeight: 0,
				    strokeOpacity: 0.5,
					fillOpacity: 0.2,
					fillColor: "#6699ff",
					clickable:false
				};
				var multipunto=eval("(" + activity.data.point + ')');
				var googlePuntos=new GeoJSON(multipunto, googleOptions);
				elpunto=new google.maps.LatLng(googlePuntos[0].position.Qa,googlePuntos[0].position.Ra);
				googleVector = new GeoJSON(jsonfromserver, googleOptions);
				googleVector.color="#FFOOOO";
				googleVector.setMap(map);
				map.panTo(new google.maps.LatLng(googlePuntos[0].position.Qa, googlePuntos[0].position.Ra));
				map.setZoom(3);
	            }
		    });
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
		console.log('asd');
		var distancia=Math.sqrt(Math.pow(elmarker.position.Qa-elpunto.Qa,2)+Math.pow(elmarker.position.Ra-elpunto.Ra,2))*60000;
		console.log(distancia);
		console.log(radio);
		if (distancia < radio) {
			Ext.Msg.alert('Right!', this.activity.data.reward, function(){
				this.getController('Careers').tolevel();
			}, this);
		}else{
			Ext.Msg.alert('Wrong!', 'Oooh, it isnt the correct place', function(){
				this.getController('Careers').tolevel();
			}, this);
		}
	}
});
