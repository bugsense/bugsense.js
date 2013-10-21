var instance = new Bugsense({apiKey: "8a581d8a"});
describe('Bugsense plugin instance', function  () {
  it('should have a valid instance', function () {
    expect(Bugsense).toBeDefined();
    expect(Bugsense).toBeTruthy();
  });
  it('should be initialized correctly',function () {
    expect(bugsense).toBeDefined();
    expect(bugsense).toBeTruthy();
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
