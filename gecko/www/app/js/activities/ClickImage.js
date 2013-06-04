var ClickImage = {
    activity: null,
    viewer: null,
    pointer: null,
    setup: function(){
        console.log('asd');
        ClickImage.viewer = $("#clickImageImage").iviewer({
            src:"http://i618.photobucket.com/albums/tt262/royallaser/FrankZappaWereOnlyInItForTheMoneyIn.jpg", 
            zoom_base:100,
            onClick: function(ev, coords) {
               ClickImage.setMarker(coords)
            },
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
        ClickImage.pointer = $("<div id='pointer'></div>");
        $('.wrapper').append(ClickImage.pointer);
        console.log(coords);
        var offset = ClickImage.viewer.iviewer('imageToContainer', coords.x, coords.y);
        var containerOffset = ClickImage.viewer.iviewer('getContainerOffset');
        
        offset.x += containerOffset.left - 20;
        offset.y += containerOffset.top - 40;
        ClickImage.pointer.css('display', 'block');
        ClickImage.pointer.css('left', offset.x+'px');
        ClickImage.pointer.css('top', offset.y+'px');
    }
};
