describe("GlobalSettings", function() {
  beforeEach(function() {


  });
  
  afterEach(function() {
        $.unblockUI();

  });

  it("should be able to give the Server URL", function() {
    expect(GlobalSettings.getServerURL()).toEqual('http://beta.drglearning.com');

  });
  it("should be able to recognize that we are not in a device", function() {
    expect(GlobalSettings.isDevice()).toEqual(false);

  });
  it("should be able to generate a hashCode from a string", function() {
    expect(GlobalSettings.hashCode("asdasd")).toEqual(-1408658752);

  });
  it("should be able to convert an int to ARGB", function() {
    expect(GlobalSettings.intToARGB(122)).toEqual("0007a");

  });
});
