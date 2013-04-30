describe("Geospatial", function() {
    var activityValueFixture = {id:1,name:"Artists's biographies",careerId:1,activity_type:"geospatial",language_code:"en",level_type:1,level_order:4,level_required:true,query:"William Blake was both a poet and an artist. Where was he born?",timestamp:"2012-04-18T18:31:54.486729",resource_uri:"/api/v1/activity/78/",reward:"Excellent!",penalty:"Ooops, try again!",played:true,successful:false,helpviewed:false,area:{ "type": "Polygon", "coordinates": [ [ [ -12.816051, 56.497789 ], [ -12.816051, 45.750799 ], [ 9.859731, 45.750799 ], [ 9.683949, 56.787751 ], [ -12.816051, 56.497789 ] ] ] },point:{ "type": "MultiPoint", "coordinates": [ [ -0.101872, 51.493819 ] ] },radius:100000};

   var levelValueFixture = {customId:1,name:"Illetratum",nameBeauty:"Illetratum",description:"Don't know anything about this? Learn your basics here!"};


    beforeEach(function() {
        $("body").append('<div id="map_canvas"></div>');

		Dao.activitiesStore.save({key:1,value:activityValueFixture});
        DrGlearning.activityId = 1;
            
    });

    afterEach(function() {
        $.unblockUI();

    });
    it("should refresh method to make the correct protocol to load map", function() {
        spyOn($, "ajax");
        Geospatial.refresh();
      
    });
    /*it("should refresh method to make the correct request", function() {

        Geospatial.start();
    });*/



});
