describe("Workflow", function() {
    var activityValueFixture = {image:null,id:1,careerId:1,activity_type:"quiz",language_code:"en",level_type:1,level_order:1,level_required:true,query:"The war of 1812 was fought between which two political entities?" ,timestamp:"2012-04-20T14:58:51.784421",resource_uri:"/api/v1/activity/1/",reward:"Good! Although it is nowadays Canada, back in 1812 it was still part of the British Empire",penalty:"Ooops, try again!", score:100, best_score:50,played:true,is_passed:false,successful:false,helpviewed:true,name:"The war of 1812 was fought between which two political entities?",image_datetime:0,query_datetime:0,image_url:"",locked_text:null,answer:null,answers:["US and Canada","US and Upper Canada","US and Lower Canada","US and the British Empire"],correct_answer:"US and the British Empire", installed:true,levels:[1,2]};

    beforeEach(function() {
		Dao.careersStore.save({key:1,value:{installed:true,levels:[1,2]	}});
	    Dao.initLevels();
        DrGlearning.levelId = 1;
        DrGlearning.careerId = 1;
		Dao.activitiesStore.save({key:1,value:activityValueFixture});
    });

    afterEach(function() {
        $.unblockUI();

    });

    it("should be able to calculate the current level of a career", function() {
        expect(Workflow.getCurrenLevel(1,1)).toEqual(1);
    });

    it("should be able to calculate the current activity of a career and a level", function() {
        expect(Workflow.getCurrenActivity(1,1)).toEqual({value : activityValueFixture , key: '1'});
    });


});
