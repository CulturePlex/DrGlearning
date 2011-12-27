Ext.define('DrGlearning.controller.activities.GeospatialController', {
    extend: 'Ext.app.Controller',
    requires: ['DrGlearning.store.Careers','DrGlearning.store.Levels','DrGlearning.view.CareersFrame'],
    views: ['ActivityFrame', 'activities.Geospatial'],
	controllers: ['DrGlearning.controller.Careers'],
    stores: ['Careers','Levels','Activities'],
	refs: [
		{
	        ref: 'activities.geospatial',
	        selector: 'mainview',
	        autoCreate: true,
	        xtype: 'mainview'
    	},{
	        ref: 'activityframe',
	        selector: 'activityframe',
	        xtype: 'activityframe'
    	}
	],	
	mapa:null,
	elmarker:null,
	elpunto:null,
	radio:null,
	activity:null,
	activityView:null,
	distancia:null,
	puntos:null,
	init: function(){
		this.levelController=this.getController('LevelController');
		console.log(this.levelController);
		console.log('asssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss');
		this.careersListController=this.getController('CareersListController');
		this.getActivityFrameView().create();
		this.activityView=this.getActivityframe();
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
		this.activity=newActivity;
		console.log(view.down('component[customId=activity]'));
		if(view.down('component[customId=activity]'))
		{
			view.down('component[customId=activity]').hide();
			view.down('component[customId=activity]').destroy();
		}
		this.activityView = Ext.create('DrGlearning.view.activities.Geospatial');
		this.activityView.down('label').setHtml(newActivity.data.query);
		this.empezar(this.activityView,newActivity);
		view.add(this.activityView);
	},
	empezar: function(view,activity) {
		// FIX: Rendering Problem von Sencha Touch 2.0.0-pr1
        view.down('map').on({
            maprender: function(){
				//Initializing map variable
				map=view.down('map').getMap();
				//Getting target points of activity
		        var multipunto=eval("(" + activity.data.point + ')');
				var googleOptions = {
						    strokeColor: "#00FFFF",
						    strokeWeight: 0,
						    strokeOpacity: 0.5,
							fillOpacity: 0.2,
							fillColor: "#6699ff",
							clickable:false
						};
				var googlePuntos=new GeoJSON(multipunto, googleOptions);
				
				
				
				//Getting first of target points as the only one valid
				elpunto=new google.maps.LatLng(googlePuntos[0].position.Qa,googlePuntos[0].position.Ra);
				//Getting radio allowed for the user
				radio=parseFloat(activity.data.radius);
				//Getting playable area
				var jsonfromserver=eval("(" + activity.data.area + ')');
				googleVector = new GeoJSON(jsonfromserver, googleOptions);
				googleVector.color="#FFOOOO";
				var puntosPoligono = googleVector.getPath();
				var bounds= new google.maps.LatLngBounds();
				console.log(bounds);
				for (i = 0; i < puntosPoligono.b.length; i++) {
					punto = new google.maps.LatLng(puntosPoligono.b[i].Qa,puntosPoligono.b[i].Ra);
					console.log(bounds.contains(punto));
  					bounds.extend(punto);
					
					console.log(bounds);
				}
				//Fitting map to playable area and setting zoom
				map.setCenter(bounds.getCenter());
				var zoomlimite=map.getZoom();
				console.log(zoomlimite);
				map.setZoom(3);
				var zoomlimite=map.getZoom();
				//limiting zoom
				google.maps.event.addListener(map, "zoom_changed", function(e1){
					console.log(map.getZoom());
					if(map.getZoom()<zoomlimite)
					{
						map.setZoom(zoomlimite);
					}
				});
				//Creating listener to recenter map when is out of playable area				
				google.maps.event.addListener(map, "bounds_changed", function(e1){
					checkBounds();
				});
				function checkBounds() {
			        // Perform the check and return if OK
			        if (bounds.contains(map.getCenter())) {
			          return;
			        }
			        // It`s not OK, so find the nearest allowed point and move there
			        var C = map.getCenter();
			        var X = C.lng();
			        var Y = C.lat();
			
			        var AmaxX = bounds.getNorthEast().lng();
			        var AmaxY = bounds.getNorthEast().lat();
			        var AminX = bounds.getSouthWest().lng();
			        var AminY = bounds.getSouthWest().lat();
			
			        if (X < AminX) {X = AminX;}
			        if (X > AmaxX) {X = AmaxX;}
			        if (Y < AminY) {Y = AminY;}
			        if (Y > AmaxY) {Y = AmaxY;}
			        //alert ("Restricting "+Y+" "+X);
			        map.setCenter(new google.maps.LatLng(Y,X));
			    }
				//Creando eventlisteners para colocar marker y circulo al pinchar
				google.maps.event.addListener(map, "mouseup", function(e){
					console.log(e);
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
		                radius: radio,
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
	            }
		    });
        
		
    },
	confirm: function() {
		console.log('asd');
		this.distancia=Math.sqrt(Math.pow(elmarker.position.Qa-elpunto.Qa,2)+Math.pow(elmarker.position.Ra-elpunto.Ra,2))*60000;
		console.log(this.distancia);
		console.log(radio);
		this.puntos= 100 - (this.distancia*100)/radio;
		console.log(this.puntos);
		if (this.distancia < radio) {
			Ext.Msg.alert('Right!', this.activity.data.reward, function(distancia){
				console.log(this.distancia);
				this.getController('DaoController').activityPlayed(this.activity.data.id,true,this.puntos);
				this.levelController.nextActivity(this.activity.data.level_type);
			}, this);
		}else{
			Ext.Msg.alert('Wrong!', 'Oooh, it isnt the correct place', function(){
				this.levelController.tolevel();
			}, this);
		}
	},
	
});
