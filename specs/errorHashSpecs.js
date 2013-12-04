describe("Bugsense::Error Hash", function(){
  beforeEach(function () {
    hash = bugsense.computeErrorHash('var a = b;', 'b is not defined', 8, 'example', '1.2.3');
  });
  it("should generate a 32-digit md5 errorHash", function(){
    var hash = bugsense.computeErrorHash('var a = b;', 'b is not defined', 8, 'example', '1.2.3');
    expect(hash.length).toEqual(32);
  });
  it("should be random", function(){
    // ensures random generation is not stupid as duck [sic]
    expect(hash.indexOf('0123456789abcdefABCDEF')).toEqual(-1);
  });
  it("should be valid hexadecimal", function(){
    expect(hash).toMatch(/[0-9a-f]{32}/);
  });
  it("should change when the errorHash changes", function(){
    var new_hash = bugsense.computeErrorHash('var a = c;', 'c is undefined', 8, 'example', '1.2.3');
    expect(new_hash).not.toBe(hash);
  });

});
