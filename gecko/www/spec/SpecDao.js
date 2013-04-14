describe("Dao", function() {
  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = '/';
	loadFixtures('index.html');
	
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

});
