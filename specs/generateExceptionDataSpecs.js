describe("Busense::Generate Exception Data", function(){
  //it should do sth
  beforeEach(function () {
    error = {
      "message": "Can't find variable: dontpanic",
      "url": "http://localhost:7000/specs/build/specs.js",
      "line": 182,
      "custom_data": {
        "rotation": "not supported"
      }
    }
    data = Bugsense.Errors.generateExceptionData(error);
  });
  it("should generate a valid crash fixture (client)", function () {
    expect(Object.keys(data.client).length).toEqual(2);
    expect(data.client.name).toBe('bugsense-js');
    expect(data.client.version).toBe('2.2.0');
  });
  it("should generate a valid crash fixture (exception)", function () {
    expect(Object.keys(data.exception).length).toEqual(5);
    expect(data.request.user_id).toBe('tsironis');
    expect(data.exception.message).toBe("Can't find variable: dontpanic");
    expect(data.exception.where).toMatch(/http:\/\/localhost:7000\/specs\/build\/specs.js/);
    expect(data.exception.breadcrumbs.length).toEqual(1);
    expect(data.request.handled).toEqual(1);
  });
  it("should generate a valid crash fixture (app environment)", function () {
    expect(data.exception.breadcrumbs[0]).toBe('after_clearing');
    expect(Object.keys(data.application_environment).length).toEqual(8);
    expect(data.application_environment.phone).toMatch(/MacIntel|Linux x86_64/);
    expect(data.application_environment.appver).toBe('1.1.1');
    expect(data.application_environment.osver).toMatch(/PPC Mac OS X|Intel Mac OS X|Linux x86_64/);
    expect(data.application_environment.appname).toBe('theApp');
    expect(data.application_environment.user_agent).toMatch(/Firefox|Chrome|PhantomJS/)
    expect(data.application_environment.cordova).toBe('unknown');
    expect(data.application_environment.device_name).toBe('unknown');
    expect(Object.keys(data.application_environment.log_data).length).toEqual(1);
  });
  it("should generate a valid backtrace", function(){
    // write expectations
    expect(data.exception.backtrace.length).toEqual(11);
  });
  it('should check for unhandled exception', function() {
    data = Bugsense.Errors.generateExceptionData(error, true);
    expect(data.request.handled).toEqual(0);
  });
});
