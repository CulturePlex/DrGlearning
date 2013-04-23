describe("Loading", function() {
    beforeEach(function() {


    });

    afterEach(function() {
        $.unblockUI();

    });

    it("should be able to calculate SHA1 of a message", function() {
        expect(Loading.SHA1("oposotoosopo")).toEqual("b1449fdfa1657a27fe6548445ff781f75e6581d7");

    });

    it("should careersRequest method make an AJAX request to the correct URL", function () {
        spyOn($, "ajax");
        Loading.careersRequest("museums","art");
        expect($.ajax.mostRecentCall.args[0]["url"]).toEqual("http://beta.drglearning.com/api/v1/career/?format=json");
    });

    it("should requestACareer method make an AJAX request to the correct URL", function () {
        spyOn($, "ajax");
        Loading.requestACareer(1);
        expect($.ajax.mostRecentCall.args[0]["url"]).toEqual("http://beta.drglearning.com/api/v1/career/1/?format=json");
    });

});
