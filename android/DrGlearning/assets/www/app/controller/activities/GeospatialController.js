Ext.define('DrGlearning.controller.activities.GeospatialController', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            activityframe: 'activityframe',
        }
    },
    mapa: null,
    elmarker: null,
    elpunto: null,
    radio: null,
    activity: null,
    distancia: null,
    puntos: null,
    bounds: null,
    view: null,
	helpFlag:false,
	zoomFlag:false,
    init: function(){
		this.helpFlag=false;
        this.levelController = this.getApplication().getController('LevelController');
        this.careersListController = this.getApplication().getController('CareersListController');
        this.control({
            'button[customId=confirm]': {
                tap: this.confirm
            }
        });
    },
    updateActivity: function(view, newActivity){
		Ext.Viewport.setMasked({
    	    xtype: 'loadmask',
    	    message: i18n.gettext('Loading activity...'),
			//html: "<img src='resources/images/activity_icons/geospatial.png'>",
 	       	indicator: true
    	});
        this.elmarker = null;
        this.elpunto = null;
        this.radio = null;
		this.view=view;	
        this.activity = newActivity;
        view.down('component[customId=activity]').destroy();
        if (view.down('component[customId=activity]')) {
            view.down('component[customId=activity]').hide();
            view.down('component[customId=activity]').destroy();
        }
        var activityView = Ext.create('DrGlearning.view.activities.Geospatial');
        this.getApplication().getController('ActivityController').addQueryAndButtons(activityView,newActivity);;
                                         
        
        //Initializing map 
        console.log(Ext.ComponentQuery.query('map'));
        var elmapa = Ext.create('Ext.Map', {
            mapOptions: {
                mapTypeControl: false,
                streetViewControl: false,
            }
        });
        var that = this;
        //Starting activity after the map is render
		google.maps.event.addListener(elmapa.getMap(), "idle", function(){
            that.empezar(activityView, newActivity);
			
        });

        
        activityView.add(elmapa);
        activityView.show();
        view.add(activityView);
		if(!this.helpFlag)
		{
			this.getApplication().getController('LevelController').help();
			this.helpFlag=true;
		}
    },
    empezar: function(view, activity){
        //Initializing map variable
        var elmapa = view.down('map');
        view.add(elmapa);
        var map = elmapa.getMap();
        google.maps.event.clearListeners(map, 'idle');
		google.maps.event.addListener(elmapa.getMap(), "idle", function(){
            Ext.Viewport.setMasked(false);
			google.maps.event.clearListeners(map, 'idle');
        });
        //Getting target points of activity
        var multipunto = eval("(" + activity.data.point + ')');
        var googleOptions = {
            strokeColor: "#00FFFF",
            strokeWeight: 0,
            strokeOpacity: 0.5,
            fillOpacity: 0.2,
            fillColor: "#6699ff",
            clickable: false
        };
        var googlePuntos = new GeoJSON(multipunto, googleOptions);
        
        //Getting first of target points as the only one valid
        elpunto = new google.maps.LatLng(googlePuntos[0].position.lat(), googlePuntos[0].position.lng());
        console.log(elpunto);
        
        //Getting radio allowed for the user
        radio = parseFloat(activity.data.radius);
        
        //Getting playable area
        var jsonfromserver = eval("(" + activity.data.area + ')');
        googleVector = new GeoJSON(jsonfromserver, googleOptions);
        googleVector.color = "#FFOOOO";
        var puntosPoligono = googleVector.getPath();
        var bounds = new google.maps.LatLngBounds();
		//bounds.union(puntosPoligono);
        for (i = 0; i < puntosPoligono.b.length; i++) {
            bounds.extend(puntosPoligono.b[i]);
        }
        
        //Fitting map to playable area and setting minZoom
        elmapa.getMap().fitBounds(bounds);    // ------------------------------>Aqui esta el pete
        var minZoom = map.getZoom();
		
        //limiting zoom
        google.maps.event.addListener(map, "zoom_changed", function(e1){
            if (map.getZoom() < minZoom-1) {
                map.setZoom(minZoom);				
            }
        });
        //Creating listener to recenter map when is out of playable area				
        google.maps.event.addListener(map, "center_changed", function(e1){
            checkBounds();
        });
        function checkBounds(){
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
            
            if (X < AminX) {
                X = AminX;
            }
            if (X > AmaxX) {
                X = AmaxX;
            }
            if (Y < AminY) {
                Y = AminY;
            }
            if (Y > AmaxY) {
                Y = AmaxY;
            }
            map.setCenter(new google.maps.LatLng(Y, X));
        }
		
        //Creating eventlisteners to set mark when click
        google.maps.event.addListener(map, "mouseup", function(e){
        
            // ESTO SOLO DEBE EJECUTARSE SI NO SE HA MOVIDO, BANDERA nos indica si se ha movido el cursor mientras movíamos o no.
            if (view.bandera == true) {
                if (view.marker) {
                    view.marker.setMap(null);
                }
                if (view.circle) {
                    view.circle.setMap(null);
                }
                
                view.circle = new google.maps.Circle({
                    center: e.latLng,
                    radius: radio,
                    //map: map,
                    clickable: false
                });
				var markerIcon = new google.maps.MarkerImage('resources/images/temp_marker.png');
                view.marker = new google.maps.Marker({
                    map: map,
                    position: e.latLng,
                    flat: true,
					clickable: false,
					icon:markerIcon
                });
                elmarker = view.marker;
            }
        });
        google.maps.event.addListener(map, "mousemove", function(e){
            view.bandera = false;
        });
        google.maps.event.addListener(map, "mousedown", function(e){
            view.bandera = true;
        });
    },
	
	//Confirmation function to try a location
    confirm: function(){
        this.distancia = Math.sqrt(Math.pow(elmarker.position.lat() - elpunto.lat(), 2) + Math.pow(elmarker.position.lng() - elpunto.lng(), 2)) * 60000;
        this.puntos = parseInt(100 - (this.distancia * 100) / radio);
        if (this.distancia < radio) {
            Ext.Msg.alert(i18n.gettext('Right!'), this.activity.data.reward+i18n.gettext("obtained score:")+this.puntos, function(distancia){
                this.getApplication().getController('DaoController').activityPlayed(this.activity.data.id, true, this.puntos);
                this.getApplication().getController('LevelController').nextActivity(this.activity.data.level_type);
            }, this);
        }
        else {
            Ext.Msg.alert(i18n.gettext('Wrong!'), i18n.gettext('Oooh, it isnt the correct place'), function(){
                this.getApplication().getController('LevelController').tolevel();
            }, this);
        }
    }
});
