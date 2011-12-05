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
		console.log(view.down('component[customId=activity]'));
		view.down('component[customId=activity]').destroy();
		activityView = Ext.create('DrGlearning.view.activities.Geospatial');
		activityView.down('label').setHtml(newActivity.data.query);
		activityView.add({
                xtype: 'toolbar',
                docked: 'bottom',
                ui: 'gray',
                items:[
                    {
						xtype: 'button',
						customId: 'backtolevel',
						text: 'Back',
						ui: 'back',
					},
					{
						 xtype: 'spacer' 
					},
					{
                        xtype: 'button',
                        text: 'Confirm',
						id: 'confirmmapposition',
						customId:'confirm'
                    }]
            });
		console.log(newActivity);
		this.initialize(activityView,newActivity);
		view.add(activityView);
	},
	elmarker:null,
	elpunto:null,
	radio:null,
	activity:null,
	initialize: function(view,activity) {
		this.activity=activity;
		console.log('dale');
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
				elpunto=new google.maps.LatLng(googlePuntos[0].position.Pa,googlePuntos[0].position.Qa);
				googleVector = new GeoJSON(jsonfromserver, googleOptions);
				googleVector.color="#FFOOOO";
				googleVector.setMap(map);
			
							
				map.panTo(new google.maps.LatLng(googlePuntos[0].position.Pa, googlePuntos[0].position.Qa));
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
		var distancia=Math.sqrt(Math.pow(elmarker.position.Pa-elpunto.Pa,2)+Math.pow(elmarker.position.Qa-elpunto.Qa,2))*60000;
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
