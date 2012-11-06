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
    setup: function(){
        $(document).on('click', '#confirmGeospatial',function(e) {
          //Geospatial.confirm();
        });
        var options= {
            mapTypeControl: false,
            streetViewControl: false
        };
        //Geospatial.map = new google.maps.Map(document.getElementById("map_canvas"), options);
	  },
    refresh: function(){
        Dao.activitiesStore.get(DrGlearning.activityId,function(activity){ 
            Geospatial.activity = activity;
            $('#geospatialActivityQuery').html(activity.value.query);
            $('#geospatialActivityName').html(activity.value.name);
            Geospatial.map = $('#map_canvas').gMap();
            //Starting activity after the map is render
            google.maps.event.addListener(Geospatial.map, "idle", function ()
            {
                Geospatial.start();
            });
	      })
	  },
    start: function ()
    {
        Geospatial.map = $('#map_canvas').gMap();
        console.log('aquiii');
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
}
