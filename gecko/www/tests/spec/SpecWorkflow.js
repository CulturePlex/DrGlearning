describe("Workflow", function() {
    var activityValueFixture = { id : 1, name : "Artists's biographies", careerId : 4, activity_type : 'geospatial', language_code : 'en', level_type : 1, level_order : 4, level_required : true, query : 'William Blake was both a poet and an artist. Where was he born?', timestamp : '2012-04-18T18:31:54.486729', resource_uri : '/api/v1/activity/78/', reward : 'Excellent!', penalty : 'Ooops, try again!', played : true, successful : false, helpviewed : false, area : '{ "type": "Polygon", "coordinates": [ [ [ -12.816051, 56.497789 ], [ -12.816051, 45.750799 ], [ 9.859731, 45.750799 ], [ 9.683949, 56.787751 ], [ -12.816051, 56.497789 ] ] ] }', point : '{ "type": "MultiPoint", "coordinates": [ [ -0.101872, 51.493819 ] ] }', radius : 100000 };
   var levelValueFixture = {customId:1,name:"Illetratum",nameBeauty:"Illetratum",description:"Don't know anything about this? Learn your basics here!"};

    var careerValueFixture =  {name:"Presentation ",description:"This course holds an example of each kind of activity for presentation purposes.",levels:[4,5,6],activities:[{full_activity_url:"/api/v1/activity/123/",resource_uri:"/api/v1/activityupdate/123/",timestamp:"2012-04-20T11:00:30.019615"},{full_activity_url:"/api/v1/activity/110/",resource_uri:"/api/v1/activityupdate/110/",timestamp:"2012-04-20T14:58:52.685003"},{full_activity_url:"/api/v1/activity/107/",resource_uri:"/api/v1/activityupdate/107/",timestamp:"2012-04-20T11:01:21.786869"},{full_activity_url:"/api/v1/activity/105/",resource_uri:"/api/v1/activityupdate/105/",timestamp:"2012-04-19T18:21:58.734173"},{full_activity_url:"/api/v1/activity/109/",resource_uri:"/api/v1/activityupdate/109/",timestamp:"2012-04-20T11:01:30.316584"},{full_activity_url:"/api/v1/activity/117/",resource_uri:"/api/v1/activityupdate/117/",timestamp:"2012-04-20T11:01:43.513716"},{full_activity_url:"/api/v1/activity/630/",resource_uri:"/api/v1/activityupdate/630/",timestamp:"2012-05-17T11:40:15.310657"},{full_activity_url:"/api/v1/activity/632/",resource_uri:"/api/v1/activityupdate/632/",timestamp:"2012-05-17T11:42:36.057754"}],installed:true,career_type:"explore",timestamp:"2013-01-21T21:04:24.095452",has_code:false};


    beforeEach(function() {
		Dao.careersStore.save({key:4,value:{installed:true,levels:[1,2]	}});
	    Dao.initLevels();
        DrGlearning.levelId = 1;
        DrGlearning.careerId = 4;
		Dao.activitiesStore.save({key:1,value:activityValueFixture});
		Dao.levelsStore.save({key:1,value:levelValueFixture});
    });

    afterEach(function() {
        $.unblockUI();

    });

    it("should be able to calculate the current level of a career", function() {
        expect(Workflow.getCurrenLevel(4,1)).toEqual(1);
    });

    it("should be able to calculate the current activity of a career and a level", function() {
        expect(Workflow.getCurrenActivity(4,1)).toEqual({value : activityValueFixture , key: '1'});
    });

    it("should be able to calculate if a level is completed", function() {
        var level = {};
        level.value = levelValueFixture;
        expect(Workflow.levelIsCompleted(level,4)).toEqual(false);
    });

    it("should be able to calculate level icons html string", function() {
        expect(Workflow.getLevelIcons(4)).toEqual("<img src='resources/images/level_icons/illetratumB.png' height = '30'><img src='resources/images/level_icons/primary.png' height = '30'>");
    });


});
