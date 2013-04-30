describe("Temporal", function() {
    var activityValueFixture = {"id":1,"name":"Temporal","careerId":"1","activity_type":"temporal","language_code":"en","level_type":1,"level_order":3,"level_required":true,"query":"Is HASTAC 2013 after or before summer?","timestamp":"2013-04-28T14:18:36.893440","resource_uri":"/api/v1/activity/1383/","reward":"Nice!","penalty":"Ooops, try again!","played":true,"successful":false,"helpviewed":false,"image_url":"images/penguin.jpg","image_datetime":"2013-07-01T14:18:00","query_datetime":"2013-04-28T14:17:00"};


    beforeEach(function() {
		Dao.activitiesStore.save({key:1,value:activityValueFixture});
		Dao.careersStore.save({key:1,value:{installed:true	}});
        DrGlearning.activityId = 1;
            
    });

    afterEach(function() {
        $.unblockUI();

    });
    it("should refresh method to make the correct protocol to load activity", function() {
        Temporal.refresh();
        expect(Temporal.activity).toEqual({value:activityValueFixture,key:1});
    });
    it("should checkAfter works without errors", function() {
        Temporal.checkAfter();
    });
    it("should checkBefore works without errors", function() {
        Temporal.checkBefore();
    });
});
