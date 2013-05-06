describe("Relational", function() {
    var activityValueFixture = {"id":1385,"name":"relational","careerId":"65","activity_type":"relational","language_code":"en","level_type":1,"level_order":5,"level_required":true,"query":"What do Javi and Elika have in common","timestamp":"2013-04-28T14:30:47.067433","resource_uri":"/api/v1/activity/1385/","reward":"Nice!","penalty":"Ooops, try again!","played":true,"successful":false,"helpviewed":false,"graph_nodes":{"Cultureplex":{"score":0,"type":"Place"},"Elika":{"end":true,"score":0,"type":"person"},"Javi":{"score":0,"start":true,"type":"person"}},"graph_edges":[{"inverse":"employs","source":"Javi","target":"Cultureplex","type":"works"},{"inverse":"employs","source":"Elika","target":"Cultureplex","type":"works"}],"constraints":[{"operator":"get","type":"person","value":"1"},{"operator":"eq","type":"Place","value":"1"}],"path_limit":10};


    beforeEach(function() {
        $("body").append('<div id="sig"></div>');
		Dao.activitiesStore.save({key:1,value:activityValueFixture});
        DrGlearning.activityId = 1;
            
    });

    afterEach(function() {
        $.unblockUI();

    });
    it("should refresh method to make the correct protocol to load activity", function() {
        Relational.refresh();
        expect(Relational.activity).toEqual({value:activityValueFixture,key:1});
    });
    it("should refresh2 method to make the process correctly", function() {
        //Linguistic.refresh2();
    });
});
