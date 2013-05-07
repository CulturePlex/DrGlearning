describe("Workflow", function() {
    var activityValueFixture = {image:null,id:1,careerId:4,activity_type:"quiz",language_code:"en",level_type:1,level_order:1,level_required:true,query:"The war of 1812 was fought between which two political entities?" ,timestamp:"2012-04-20T14:58:51.784421",resource_uri:"/api/v1/activity/1/",reward:"Good! Although it is nowadays Canada, back in 1812 it was still part of the British Empire",penalty:"Ooops, try again!", score:100, best_score:50,played:true,is_passed:false,successful:false,helpviewed:true,name:"The war of 1812 was fought between which two political entities?",image_datetime:0,query_datetime:0,image_url:"",locked_text:null,answer:null,answers:["US and Canada","US and Upper Canada","US and Lower Canada","US and the British Empire"],correct_answer:"US and the British Empire", installed:true,levels:[1,2]};
   var levelValueFixture = {customId:1,name:"Illetratum",nameBeauty:"Illetratum",description:"Don't know anything about this? Learn your basics here!"};


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
