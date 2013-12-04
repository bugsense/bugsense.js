localStorage.clear();
localStorage.setItem('bugsense_uid', 'this-is-a-uid');
describe('Bugsense::Instance', function  () {
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
    expect(typeof(Bugsense.prototype.sendCachedReport)).toBe('function');
    expect(typeof(Bugsense.prototype.successHandler)).toBe('function');
    expect(typeof(Bugsense.prototype.testException)).toBe('function');
  });
})
describe('Bugsense::Configuration', function () {
  it('should have correct default attributes',function () {
    expect(Bugsense.prototype.config.url).toBe('https://www.bugsense.com/api/errors');
    expect(Bugsense.prototype.config.apiKey).toBe('FOOBAR');
    expect(Bugsense.prototype.config.winjs).toBeFalsy();
  });
  it("should change correctly an attribute", function(){
    window.bugsense = new Bugsense({
      apiKey: "8a581d8a",
      appname: 'theApp',
      appver: '1.1.1'
    });
    expect(Bugsense.prototype.config.apiKey).not.toBe('FOOBAR');
    expect(bugsense.config.apiKey).toBe("8a581d8a");
  });
});
describe('Bugsense::Unique ID', function() {
  it("should have a retain a saved uid", function(){
    // write expectations
    expect(bugsense.config.uid).toBe('this-is-a-uid');
  });

  it("should generate a correct uid", function(){
    // write expectations
    localStorage.clear();
    expect(bugsense.generateUid()).toMatch(new RegExp(/\w+\-|\w+/));
    expect(localStorage.getItem('bugsense_uid')).toMatch(new RegExp(/\+\-|\w+/));
  });
});
describe('Bugsense::Data fixture', function () {
  it("should have correct data fixture", function(){
    expect(bugsense.dataFixture.client.name).toBe("bugsense-js");
    expect(bugsense.dataFixture.client.version).toBe("2.0");
    expect(bugsense.dataFixture.application_environment.appname).toBe("theApp");
    expect(bugsense.dataFixture.application_environment.appver).toBe("1.1.1");
    expect(bugsense.dataFixture.application_environment.osver).toBe("Intel Mac OS X");
    expect(bugsense.dataFixture.application_environment.cordova).toBe("unknown");
    expect(bugsense.dataFixture.application_environment.device_name).toBe("unknown");
    expect(bugsense.dataFixture.application_environment.phone).toBe("MacIntel");
    expect(Object.keys(bugsense.dataFixture.application_environment.log_data).length).toEqual(0);
  });
});
