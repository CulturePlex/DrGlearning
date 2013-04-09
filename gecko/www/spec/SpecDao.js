describe("Dao", function() {

  beforeEach(function() {


  });

  it("should userStore to be accesible", function() {
    expect(Dao.userStore).not.toBe(null);

  });
  it("should careersStore to be accesible", function() {
    expect(Dao.careersStore).not.toBe(null);

  });

});
