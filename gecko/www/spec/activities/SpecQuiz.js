describe("Quiz", function() {
    var activityValueFixture = {activity_type: "quiz",
        answers: [
        "Bronzino",
        "Francisco de Goya",
        "Orazio Gentileschi",
        "Caravaggio",
        "Leonardo da Vinci"],
        length: 5,
        careerId: "1",
        correct_answer: "Caravaggio",
        helpviewed: false,
        id: 1,
        image_url: "images/tmpd2IyTO.jpg",
        language_code: "en",
        level_order: 1,
        level_required: true,
        level_type: 1,
        name: "Artists and their work",
        penalty: "Ooops, try again!",
        played: true,
        query: "Who painted this Medusa?",
        resource_uri: "/api/v1/activity/75/",
        reward: "OK!",
        successful: false,
        timestamp: "2012-04-20T14:58:51.988844"
    };


    beforeEach(function() {
		Dao.activitiesStore.save({key:1,value:activityValueFixture});
        DrGlearning.activityId = 1;
            
    });

    afterEach(function() {
        $.unblockUI();

    });
    it("should refresh method to make the correct protocol to load an activity", function() {
        Quiz.refresh();
        expect(Quiz.activity).toEqual({value:activityValueFixture,key:1});
    });
});
