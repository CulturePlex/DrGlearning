var ClickImage = {
    activity: null,
    viewer: null,
    pointers: [],
    coords: [],
    timer: null,
    is_dragging: null,
    setup: function(){
        ClickImage.is_dragging = false;     
  
        ClickImage.viewer = $("#clickImageImage").iviewer({
            src:"http://i618.photobucket.com/albums/tt262/royallaser/FrankZappaWereOnlyInItForTheMoneyIn.jpg", 
            zoom_base:100,
            onClick: function(ev, coords) {
               console.log(ClickImage.is_dragging);
               if (!ClickImage.is_dragging)
                   ClickImage.setMarker({x: coords.x, y: coords.y});
            },
            onAfterZoom: function(ev, new_zoom){
               if(ClickImage.coords != null)
               ClickImage.replaceMarkers();
            },
            onDrag: function (ev, point){
               if(ClickImage.coords != null)
               ClickImage.replaceMarkers();
            },
            onStartDrag: function (ev, point){
                ClickImage.is_dragging = true;
                console.log("start Drag");
            },
            onStopDrag: function (ev, point){
                setTimeout(function(){ClickImage.is_dragging = false;},100);
                console.log("stop Drag");
            }
        });
        $("#in").click(function(){ viewer.iviewer('zoom_by', 1); }); 
        $("#out").click(function(){ viewer.iviewer('zoom_by', -1); }); 
        $("#fit").click(function(){ viewer.iviewer('fit'); }); 
        $("#orig").click(function(){ viewer.iviewer('set_zoom', 100); }); 
        $("#update").click(function(){ viewer.iviewer('update_container_info'); });
        $(".iviewer_rotate_right").hide();
        $(".iviewer_rotate_left").hide();
        $('#clickImage').live( 'pageshow',function(event){
           ClickImage.viewer.iviewer('update');
        });

    },
    refresh: function(){
    
    },
    setMarker: function(coords){
        ClickImage.coords.push(coords);
        ClickImage.pointers.push($("<div id='pointer'></div>"));
        $('.wrapper').append(ClickImage.pointers[ClickImage.pointers.length - 1]);

        console.log(coords);
        var offset = ClickImage.viewer.iviewer('imageToContainer', coords.x, coords.y);
        var containerOffset = ClickImage.viewer.iviewer('getContainerOffset');
        
        offset.x += containerOffset.left - 20;
        offset.y += containerOffset.top - 40;
        ClickImage.pointers[ClickImage.pointers.length - 1].css('display', 'block');
        ClickImage.pointers[ClickImage.pointers.length - 1].css('left', (offset.x - 9) +'px');
        ClickImage.pointers[ClickImage.pointers.length - 1].css('top', (offset.y - 22) +'px');
    },
    replaceMarkers: function(){
        for (var i=0; i<ClickImage.pointers.length;i++)
        {
            ClickImage.replaceMarker(ClickImage.pointers[i],ClickImage.coords[i]);
        }
    },
    replaceMarker: function(marker,coords){
        console.log(marker);
        console.log(coords);
        var offset = ClickImage.viewer.iviewer('imageToContainer', coords.x, coords.y);
        var containerOffset = ClickImage.viewer.iviewer('getContainerOffset');
        
        offset.x += containerOffset.left - 20;
        offset.y += containerOffset.top - 40;
        marker.css('display', 'block');
        marker.css('left', (offset.x - 9)+'px');
        marker.css('top', (offset.y - 22)+'px');
    }



};
