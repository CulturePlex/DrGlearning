/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/

/*global
    Ext Jed catalogueEN catalogueES catalogueFR i18n google GeoJSON StackTrace
*/

try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.controller.activities.GeospatialController', {
            extend: 'Ext.app.Controller',

            marker: null,
            target: null,
            radius: null,
            activity: null,
            zoomFlag: false,
            mouseFlag: false,

            init: function ()
            {
                this.helpFlag = false;
                this.levelController = this.getApplication().getController('LevelController');
                this.careersListController = this.getApplication().getController('CareersListController');
                this.activityController = this.getApplication().getController('ActivityController');
                this.daoController = this.getApplication().getController('DaoController');
                this.control({
                    'button[customId=confirm]': {
                        tap: this.confirm
                    }
                });
            },
            updateActivity: function (view, newActivity)
            {
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: i18n.gettext('Loading activity') + "…",
                    //html: "<img src='resources/images/activity_icons/geospatial.png'>",
                    indicator: true
                });
                this.marker = null;
                this.target = null;
                this.radius = null;
                this.activity = newActivity;
                view.down('component[customId=activity]').destroy();
                var activityView = Ext.create('DrGlearning.view.activities.Geospatial');
                this.activityController.addQueryAndButtons(activityView, newActivity);
                //Initializing map 
                var senchaMap = Ext.create('Ext.Map', {
                    mapOptions: {
                        mapTypeControl: false,
                        streetViewControl: false
                    }
                });
                var that = this;
                //Starting activity after the map is render
                google.maps.event.addListener(senchaMap.getMap(), "idle", function ()
                {
                    that.start(activityView, newActivity);
                });
                activityView.add(senchaMap);
                activityView.show();
                view.add(activityView);
                if (!newActivity.data.helpviewed) {
                    newActivity.data.helpviewed = true;
                    newActivity.save();
                    this.levelController.helpAndQuery();
                }
            },
            start: function (view, activity)
            {
                //Initializing map variable
                var senchaMap = view.down('map');
                view.add(senchaMap);
                var map = senchaMap.getMap();
                google.maps.event.clearListeners(map, 'idle');
                google.maps.event.addListener(senchaMap.getMap(), "idle", function ()
                {
                    Ext.Viewport.setMasked(false);
                    google.maps.event.clearListeners(map, 'idle');
                });
                //Getting target points of activity
                var multipunto = JSON.parse(activity.data.point);
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
                this.target = new google.maps.LatLng(geoPoints[0].position.lat(), geoPoints[0].position.lng());
                //Getting radius allowed for the user
                this.radius = parseFloat(activity.data.radius);
                //Getting playable area
                var jsonfromserver = JSON.parse(activity.data.area);
                var googleVector = new GeoJSON(jsonfromserver, googleOptions);
                googleVector.color = "#FFOOOO";
                var puntosPoligono = googleVector.getPath();
                var bounds = new google.maps.LatLngBounds();
                //bounds.union(puntosPoligono);
                for (var i = 0; i < puntosPoligono.b.length; i++) {
                    bounds.extend(puntosPoligono.b[i]);
                }
                //Fitting map to playable area and setting minZoom
                senchaMap.getMap().fitBounds(bounds);
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
                var that = this;
                //Creating eventlisteners to set mark when click
                google.maps.event.addListener(map, "mouseup", function (e)
                {
                    // ESTO SOLO DEBE EJECUTARSE SI NO SE HA MOVIDO, BANDERA nos indica si se ha movido el cursor mientras movíamos o no.
                    if (that.mouseFlag === true) 
                    {
                        if (that.marker) {
                            that.marker.setMap(null);
                        }
                        var markerIcon = new google.maps.MarkerImage('resources/images/temp_marker.png');
                        that.marker = new google.maps.Marker({
                            map: map,
                            position: e.latLng,
                            flat: true,
                            clickable: false,
                            icon: markerIcon
                        });
                    }
                }, that);
                google.maps.event.addListener(map, "mousemove", function (e)
                {
                    that.mouseFlag = false;
                }, that);
                google.maps.event.addListener(map, "mousedown", function (e)
                {
                    that.mouseFlag = true;
                }, that);
            },
            
            //Confirmation function to try a location
            confirm: function ()
            {
                var score = 0;
                var distance = Math.sqrt(Math.pow(this.marker.position.lat() - this.target.lat(), 2) + Math.pow(this.marker.position.lng() - this.target.lng(), 2)) * 60000;
                score = parseInt(100 - (distance * 100) / this.radius, 10);
                if (distance < this.radius) {
					if(score < 50){score = 50;}
                    Ext.Msg.alert(i18n.gettext('Right!'), this.activity.data.reward + ' <br />' + i18n.gettext("Score") + ": " + score, function ()
                    {
                        this.daoController.activityPlayed(this.activity.data.id, true, score);
                    }, this);
                }
                else {
                    if(score < 0){score = 0;}
                    Ext.Msg.alert(i18n.gettext('Wrong!'), this.activity.data.penalty, function ()
                    {
                        this.daoController.activityPlayed(this.activity.data.id, false, score);
                    }, this);
                }
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
