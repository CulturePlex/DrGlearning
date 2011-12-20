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
		//console.log(view.down('component[customId=activity]'));
		view.down('component[customId=activity]').hide();
		view.down('component[customId=activity]').destroy();
		this.activityView = Ext.create('DrGlearning.view.activities.Geospatial');
		this.activityView.down('label').setHtml(newActivity.data.query);
		this.empezar(this.activityView,newActivity);
		view.add(this.activityView);
	},
	empezar: function(view,activity) {
		
		// FIX: Rendering Problem von Sencha Touch 2.0.0-pr1
        view.down('map').on({
            maprender: function(){
				console.log(view.down('map').getMap());
				map=view.down('map').getMap();
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
				
				map.panTo(googlePuntos[0].position);
				var jsonfromserver=eval("(" + activity.data.area + ')');
				
				elpunto=new google.maps.LatLng(googlePuntos[0].position.Qa,googlePuntos[0].position.Ra);
				
				radio=parseFloat(activity.data.radius);
				
				googleVector = new GeoJSON(jsonfromserver, googleOptions);
				googleVector.color="#FFOOOO";
				googleVector.setMap(map);
				map.setZoom(3);
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
		var distancia=Math.sqrt(Math.pow(elmarker.position.Qa-elpunto.Qa,2)+Math.pow(elmarker.position.Ra-elpunto.Ra,2))*60000;
		console.log(distancia);
		console.log(radio);
		if (distancia < radio) {
			Ext.Msg.alert('Right!', this.activity.data.reward, function(){
				this.getController('DaoController').activityPlayed(this.activity.data.id,true,500);
				this.levelController.nextActivity();
			}, this);
		}else{
			Ext.Msg.alert('Wrong!', 'Oooh, it isnt the correct place', function(){
				this.levelController.tolevel();
			}, this);
		}
	},
	
});
