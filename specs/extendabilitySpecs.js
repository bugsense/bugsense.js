describe("Bugsense::Extendability", function(){
  it("should be extendable", function(){
    // write expectations
    extend(Bugsense.prototype, {
      generateExceptionData: function () {
        window.LALALA = true;
      }
    });
    window.bugsense = new Bugsense({apiKey: "8a581d8a"});
    bugsense.generateExceptionData();
    expect(window.LALALA).toBeTruthy();
  });
});
