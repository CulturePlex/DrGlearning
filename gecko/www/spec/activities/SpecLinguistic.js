describe("Linguistic", function() {
    var activityValueFixture = {activity_type: "linguistic", 
    answer: "Erasmus", 
    careerId: "1", 
    helpviewed: false, 
    id: 1, 
    image_url: "images/tmpNUhIoR.jpg", 
    language_code: "en", 
    level_order: 2,
    level_required: true,
    level_type: 1,
    locked_text: "Erasmus",
    name: "Artists and their work",
    penalty: "Ooops, try again!",
    played: true,
    query: "Who is portrayed in this painting by Hans Holbein the younger?",
    resource_uri: "/api/v1/activity/76/",
    reward: "Very good! This is one of the best known portraits of Eramus",
    successful: false,
    timestamp: "2012-04-19T10:49:23.394526"};


    beforeEach(function() {
		Dao.activitiesStore.save({key:1,value:activityValueFixture});
        DrGlearning.activityId = 1;
            
    });

    afterEach(function() {
        $.unblockUI();

    });
    it("should refresh method to make the correct protocol to load activity", function() {
        Linguistic.refresh();
        expect(Linguistic.activity).toEqual({value:activityValueFixture,key:1});
    });
    it("should refresh2 method to make the process correctly", function() {
        Linguistic.refresh2();
    });
});
