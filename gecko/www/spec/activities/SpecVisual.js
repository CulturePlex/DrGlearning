describe("Visual", function() {
    var activityValueFixture = {"id":1,"name":"Who's the author?","careerId":"1","activity_type":"visual","language_code":"en","level_type":8,"level_order":3,"level_required":true,"query":"Who wrote these lines?","timestamp":"2012-04-18T18:31:37.249901","resource_uri":"/api/v1/activity/62/","reward":"Nice! Elizabeth Bishop!","penalty":"Ooops, try again!","played":true,"successful":false,"helpviewed":false,"image_url":"images/tmpgzJ8Lr.jpg","obfuscated_image_url":"images/tmpoMPtl5.png","answers":["Joseph Brodsky","Derek Walcott","Seamus Heaney","Robert Frost","Elizabeth Bishop"],"correct_answer":"Elizabeth Bishop","time":"10"};


    beforeEach(function() {
        //$("body").append('<ul data-role="listview" id="visualAnswersList"></ul>');
		Dao.activitiesStore.save({key:1,value:activityValueFixture});
		Dao.careersStore.save({key:1,value:{installed:true	}});
        DrGlearning.activityId = 1;
            
    });

    afterEach(function() {
        $.unblockUI();

    });
    it("should refresh method to make the correct protocol to load activity", function() {
        //Visual.refresh();
        //expect(Visual.activity).toEqual({value:activityValueFixture,key:1});
    });
    it("should checkAfter works without errors", function() {
        Temporal.checkAfter();
    });
    it("should checkBefore works without errors", function() {
        Temporal.checkBefore();
    });
});
