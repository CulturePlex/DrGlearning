var ClickImage = {
    activity: null,
    viewer: null,
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
        $( '#clickImage' ).live( 'pageshow',function(event){
           ClickImage.viewer.iviewer('update');
        });
    },
    refresh: function(){
    
    },
    setMarker: function(coords){
        var pointer = $('.wrapper').append("<div id='pointer'></div>");
        console.log(coords);
        pointer.css('display', 'block');
        pointer.css('left', coords.x+'px');
        pointer.css('top', coords.y+'px');
    }
};
