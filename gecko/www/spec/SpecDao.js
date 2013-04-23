describe("Dao", function() {
  beforeEach(function() {
        loadFixtures('index-fixture.html');
		Dao.activitiesStore.save({key:1,value:{played:false	}});
		Dao.careersStore.save({key:1,value:{installed:true	}});
  });

  it("should userStore to be accesible", function() {
    expect(Dao.userStore).not.toBe(null);

  });
  it("should careersStore to be accesible", function() {
    expect(Dao.careersStore).not.toBe(null);

  });
  it("should levelsStore to be accesible", function() {
    expect(Dao.levelsStore).not.toBe(null);

  });
  it("should create first level as Illetratum after initLevels()", function() {
	Dao.initLevels();
	var level;
 	Dao.levelsStore.get(1, function(me) {
        level = me;
    });
    expect(level.value.name).toBe("Illetratum");
  });
  it("should activitiesStore to be accesible", function() {
    expect(Dao.activitiesStore).not.toBe(null);
  });
  it("should knowledgesStore to be accesible", function() {
    expect(Dao.knowledgesStore).not.toBe(null);
  });
  /*it("should activityPlayed() mark activity as played in store", function() {
	Dao.activityPlayed(1,true,100);
	var activity;
 	Dao.activitiesStore.get(1, function(me) {
        activity = me;
    });
	expect(activity.value.played).toBe(true);
  });*/
  it("should uninstall() mark career as not installed", function() {
	Dao.uninstall(1);
	var career;
 	Dao.careersStore.get(1, function(me) {
        career = me;
    });
	expect(career.value.installed).toBe(false);
  });
});
