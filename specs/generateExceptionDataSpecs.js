describe("Busense::Generate Exception Data", function(){
  //it should do sth
  beforeEach(function () {
    data = bugsense.generateExceptionData('ReferenceError: b is not defined', 'http://localhost:7000/playground/example.js', 8, undefined, undefined)
  });
  it("should generate a valid crash fixture (client)", function () {
    expect(Object.keys(data.client).length).toEqual(2);
    expect(data.client.name).toBe('bugsense-js');
    expect(data.client.version).toBe('2.0');
  });
  it("should generate a valid crash fixture (exception)", function () {
    expect(Object.keys(data.exception).length).toEqual(5);
    expect(data.request.custom_data.length).toEqual(0);
    expect(data.request.user_id).toBe('tsironis');
    expect(data.exception.message).toBe('b is not defined');
    expect(data.exception.klass).toBe('example');
    expect(data.exception.where).toBe('http://localhost:7000/playground/example.js:8');
    expect(data.exception.backtrace.length).toEqual(11);
    expect(data.exception.breadcrumbs.length).toEqual(1);
  });
  it("should generate a valid crash fixture (app environment)", function () {
    expect(data.exception.breadcrumbs[0]).toBe('after_clearing');
    expect(Object.keys(data.application_environment).length).toEqual(8);
    expect(data.application_environment.phone).toMatch(/MacIntel|Linux x86_64/);
    expect(data.application_environment.appver).toBe('1.1.1');
    expect(data.application_environment.osver).toMatch(/Intel Mac OS X|Linux x86_64/);
    expect(data.application_environment.appname).toBe('theApp');
    expect(data.application_environment.user_agent).toMatch(/Firefox|Chrome|PhantomJS 1.9.2/)
    expect(data.application_environment.cordova).toBe('unknown');
    expect(data.application_environment.device_name).toBe('unknown');
    expect(Object.keys(data.application_environment.log_data).length).toEqual(0);
  });
  it("should generate a valid backtrace", function(){
    // write expectations
    expect(data.exception.backtrace.length).toEqual(11);
    expect(data.exception.backtrace[5]).toBe('  var a = b + 3;');
  });
  it("should get the offending line", function () {
    bugsense.getOffendingLine(data.exception.backtrace, 8);
  });
});
