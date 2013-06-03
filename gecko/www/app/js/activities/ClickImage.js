var ClickImage = {
    activity: null,
    setup: function(){
        console.log('asd');

        var iv1 = $("#clickImageImage").iviewer({src:"http://i618.photobucket.com/albums/tt262/royallaser/FrankZappaWereOnlyInItForTheMoneyIn.jpg"});
        $("#in").click(function(){ iv1.iviewer('zoom_by', 1); }); 
        $("#out").click(function(){ iv1.iviewer('zoom_by', -1); }); 
        $("#fit").click(function(){ iv1.iviewer('fit'); }); 
        $("#orig").click(function(){ iv1.iviewer('set_zoom', 100); }); 
        $("#update").click(function(){ iv1.iviewer('update_container_info'); });
    },
    refresh: function(){
    
    },
    
};
