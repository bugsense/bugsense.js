describe('Bugsense plugin instance', function  () {
  it('should have a valid instance', function () {
    expect(Bugsense).toBeDefined();
    expect(Bugsense).toBeTruthy();
  });
  it('should contain the correct methods', function () {
    expect(typeof(Bugsense.prototype.config)).toBe('object');
    expect(typeof(Bugsense.prototype.addExtraData)).toBe('function');
    expect(typeof(Bugsense.prototype.clearBreadcrumbs)).toBe('function');
    expect(typeof(Bugsense.prototype.clearExtraData)).toBe('function');
    expect(typeof(Bugsense.prototype.generateExceptionData)).toBe('function');
    expect(typeof(Bugsense.prototype.getPostURL)).toBe('function');
    expect(typeof(Bugsense.prototype.isBugsenseException)).toBe('function');
    expect(typeof(Bugsense.prototype.leaveBreadcrumb)).toBe('function');
    expect(typeof(Bugsense.prototype.notify)).toBe('function');
    expect(typeof(Bugsense.prototype.onerror)).toBe('function');
    expect(typeof(Bugsense.prototype.onpromiseerror)).toBe('function');
    expect(typeof(Bugsense.prototype.parseError)).toBe('function');
    expect(typeof(Bugsense.prototype.removeExtraData)).toBe('function');
    expect(typeof(Bugsense.prototype.send_cached_report_if_any)).toBe('function');
    expect(typeof(Bugsense.prototype.successHandler)).toBe('function');
    expect(typeof(Bugsense.prototype.testException)).toBe('function');
  });
})
describe('Bugsense configuration', function () {
  it('should have correct default attributes',function () {
    expect(Bugsense.prototype.config.url).toBe("https://www.bugsense.com/api/errors");
    expect(Bugsense.prototype.config.apiKey).toBe('FOOBAR');
    expect(Bugsense.prototype.config.apiKey).toBe('FOOBAR');
    expect(Bugsense.prototype.config.pingUrl).toBe('http://ticks2.bugsense.com/api/ticks');
    expect(Bugsense.prototype.config.winjs).toBeFalsy();
    expect(Bugsense.prototype.config.winjs).toBeFalsy();
    expect(Bugsense.prototype.config.message).toBeNull();
    expect(Bugsense.prototype.config.callback).toBeNull();
    expect(Bugsense.prototype.config.appversion).toBeNull();
  });
  it("should change correctly an attribute", function(){
    window.bugsense = new Bugsense({apiKey: "8a581d8a"});
    expect(Bugsense.prototype.config.apiKey).not.toBe('FOOBAR');
    expect(bugsense.config.apiKey).toBe("8a581d8a");
  });
});

describe("Bugsense::ExtraData", function(){
  it("should add extra data correctly", function(){
    bugsense.addExtraData( 'user_type', 'CEO' );
    expect(bugsense.extraData.length).not.toEqual(0);
    expect(bugsense.extraData.user_type).toBe('CEO');
  });
});
