var Geospatial = {
    activity: null,
    score: null,
    map: null,
    marker: null,
    target: null,
    radius: null,
    activity: null,
    zoomFlag: false,
    mouseFlag: false,
	helpViewed: false,
    setup: function(){

        $(document).on('click', '#confirmGeospatial',function(e) {
          Geospatial.confirm();
        });
	  },
	refresh: function(){
		google.load("maps", "3", {other_params:'format=json&sensor=false', callback: Geospatial.refresh2});
	},
	refresh2: function(){
        Dao.activitiesStore.get(DrGlearning.activityId,function(activity){ 
            Geospatial.activity = activity;
            $('#geospatialActivityQuery').html(activity.value.query);
            $('#geospatialActivityName').html(activity.value.name);
			$.blockUI({ message: '<img src="resources/images/ic_launcher.png" /><p>'+i18n.gettext('Loading Activity...')+'</p>' });
            Geospatial.map = $('#map_canvas').gMap();
            //Starting activity after the map is render
            google.maps.event.addListener(Geospatial.map, "idle", function ()
            {
				$.unblockUI();
                Geospatial.start();
				if(!Geospatial.helpViewed)
				{
					$('#infoGeospatial').click();
					Geospatial.helpViewed = true;
				}
            });
	      })
	},
    start: function ()
    {
        Geospatial.map = $('#map_canvas').gMap();
        //Initializing map variable
        var map = Geospatial.map;
        google.maps.event.clearListeners(map, 'idle');
        //Getting target points of activity
        var multipunto = JSON.parse(Geospatial.activity.value.point);
        var googleOptions = {
            strokeColor: "#00FFFF",
            strokeWeight: 0,
            strokeOpacity: 0.5,
            fillOpacity: 0.2,
            fillColor: "#6699ff",
            clickable: false
        };
        var geoPoints = new GeoJSON(multipunto, googleOptions);
        //Getting first of target points as the only one valid
        Geospatial.target = new google.maps.LatLng(geoPoints[0].position.lat(), geoPoints[0].position.lng());
        //Getting radius allowed for the user
        Geospatial.radius = parseFloat(Geospatial.activity.value.radius);
        //Getting playable area
        var jsonfromserver = JSON.parse(Geospatial.activity.value.area);
        var googleVector = new GeoJSON(jsonfromserver, googleOptions);
        googleVector.color = "#FFOOOO";
        var puntosPoligono = googleVector.getPath();
        var bounds = new google.maps.LatLngBounds();
        //bounds.union(puntosPoligono);
        for (var i = 0; i < puntosPoligono.b.length; i++) {
            bounds.extend(puntosPoligono.b[i]);
        }
        //Fitting map to playable area and setting minZoom
        map.fitBounds(bounds);
        var minZoom = map.getZoom();
        //limiting zoom
        google.maps.event.addListener(map, "zoom_changed", function (e1)
        {
            if (map.getZoom() < minZoom - 1) {
                map.setZoom(minZoom);
            }
        });
        //Function to check if the window is in the allowed area
        function checkBounds()
        {
            // Perform the check and return if OK
            if (bounds.contains(map.getCenter())) {
                return;
            }
            // It's not OK, so find the nearest allowed point and move there
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
        //Creating listener to recenter map when is out of playable area				
        google.maps.event.addListener(map, "center_changed", function (e1)
        {
            checkBounds();
        });
        //Creating eventlisteners to set mark when click
        google.maps.event.addListener(map, "mouseup", function (e)
        {
            // ESTO SOLO DEBE EJECUTARSE SI NO SE HA MOVIDO, BANDERA nos indica si se ha movido el cursor mientras movíamos o no.
            if (Geospatial.mouseFlag === true) 
            {
                if (Geospatial.marker) {
                    Geospatial.marker.setMap(null);
                }
                var markerIcon = new google.maps.MarkerImage('resources/images/temp_marker.png');
                Geospatial.marker = new google.maps.Marker({
                    map: map,
                    position: e.latLng,
                    flat: true,
                    clickable: false,
                    icon: markerIcon
                });
            }
        });
        google.maps.event.addListener(map, "mousemove", function (e)
        {
            Geospatial.mouseFlag = false;
        });
        google.maps.event.addListener(map, "mousedown", function (e)
        {
            Geospatial.mouseFlag = true;
        });
    },
    confirm: function ()
    {
        Geospatial.score = 0;
        var distance = Math.sqrt(Math.pow(Geospatial.marker.position.lat() - Geospatial.target.lat(), 2) + Math.pow(Geospatial.marker.position.lng() - Geospatial.target.lng(), 2)) * 60000;
        Geospatial.score = parseInt(100 - (distance * 100) / Geospatial.radius, 10);
        if(Geospatial.score < 0)
        {
            Geospatial.score = 0;
        }
        if (distance < Geospatial.radius) {
			if(Geospatial.score < 50){Geospatial.score = 50;}
            $('#dialogText').html(Geospatial.activity.value.reward+"<br /><br />"+i18n.gettext('Score')+": "+Geospatial.score);
			Dao.activityPlayed(Geospatial.activity.value.id, true, Geospatial.score);
        }
        else {
  	        $('#dialogText').html(Geospatial.activity.value.penalty);
			Dao.activityPlayed(Geospatial.activity.value.id, false, Geospatial.score);
			Workflow.toLevel = true;
        }
    }
}
