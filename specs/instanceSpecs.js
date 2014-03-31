localStorage.clear();
localStorage.setItem('bugsense_uid', 'this-is-a-uid');
describe('Bugsense::Instance', function  () {
  it('should have a valid instance', function () {
    expect(Bugsense).toBeDefined();
    expect(Bugsense).toBeTruthy();
  });
  it('should contain the correct methods', function () {
    expect(typeof(Bugsense.config)).toBe('object');
    expect(typeof(Bugsense.addExtraData)).toBe('function');
    expect(typeof(Bugsense.clearBreadcrumbs)).toBe('function');
    expect(typeof(Bugsense.clearExtraData)).toBe('function');
    expect(typeof(Bugsense.startSession)).toBe('function');
    expect(typeof(Bugsense.closeSession)).toBe('function');
    expect(typeof(Bugsense.sendEvent)).toBe('function');
    expect(typeof(Bugsense.Network.getCrashURL)).toBe('function');
    expect(typeof(Bugsense.Network.getTicksURL)).toBe('function');
    expect(typeof(Bugsense.leaveBreadcrumb)).toBe('function');
    expect(typeof(Bugsense.notify)).toBe('function');
    expect(typeof(Bugsense.Errors.parse)).toBe('function');
    expect(typeof(Bugsense.removeExtraData)).toBe('function');
    expect(typeof(Bugsense.Cache.sendCache)).toBe('function');
    expect(typeof(Bugsense.Cache.update)).toBe('function');
    expect(typeof(Bugsense.Cache.save)).toBe('function');
    expect(typeof(Bugsense.Cache.retrieve)).toBe('function');
    expect(typeof(Bugsense.Sessions.ping)).toBe('function');
    expect(typeof(Bugsense.Sessions.gnip)).toBe('function');
    expect(typeof(Bugsense.Sessions.event)).toBe('function');
    expect(typeof(Bugsense.Sessions.createFlatline)).toBe('function');
    expect(typeof(Bugsense.Sessions.validSession)).toBe('function');
    expect(typeof(Bugsense.Sessions.generateUid)).toBe('function');
  });
})
describe('Bugsense::Configuration', function () {
  it('should have correct default attributes',function () {
    expect(Bugsense.config.url).toBe('https://www.bugsense.com/api/errors');
    expect(Bugsense.config.apiKey).toBeNull();
  });
  it("should change correctly an attribute", function(){
    Bugsense.initAndStartSession({
      apiKey: "8a581d8a",
      appname: 'theApp',
      appver: '1.1.1',
      userIdentifier: 'tsironis'
    });
    expect(Bugsense.config.apiKey).toBe("8a581d8a");
    expect(Bugsense.config.appname).toBe("theApp");
    expect(Bugsense.config.appver).toBe("1.1.1");
    expect(Bugsense.config.userIdentifier).toBe("tsironis");
  });
  describe('Bugsense::Data fixture', function () {
    it("should have correct data fixture", function(){
      var dataFixture = Bugsense.generateFixture();
      expect(dataFixture.client.name).toBe("bugsense-js");
      expect(dataFixture.client.version).toBe('2.0.1');
      expect(dataFixture.application_environment.appname).toBe("theApp");
      expect(dataFixture.application_environment.appver).toBe("1.1.1");
      expect(dataFixture.application_environment.osver).toMatch(/Intel Mac OS X|Linux x86_64/);
      expect(dataFixture.application_environment.cordova).toBe("unknown");
      expect(dataFixture.application_environment.device_name).toBe("unknown");
      expect(dataFixture.application_environment.phone).toMatch(/MacIntel|Linux x86_64/);
      expect(Object.keys(dataFixture.application_environment.log_data).length).toEqual(0);
    });
  });
});
describe('Bugsense::Unique ID', function() {
  it("should have a retain a saved uid", function(){
    // write expectations
    expect(Bugsense.config.uid).toMatch(new RegExp(/([a-f0-9\-])+/));
  });

  it("should generate a correct uid", function(){
    // write expectations
    localStorage.clear();
    expect(Bugsense.Sessions.generateUid()).toMatch(new RegExp(/([a-f0-9\-])+/));
    expect(localStorage.getItem('bugsense:uid')).toMatch(new RegExp(/([a-f0-9\-])+/));
  });
});

