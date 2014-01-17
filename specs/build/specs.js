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
      appver: '1.1.1',
      userIdentifier: 'tsironis'
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
    expect(bugsense.dataFixture.request.user_id).toBe("tsironis");
    expect(bugsense.dataFixture.application_environment.appname).toBe("theApp");
    expect(bugsense.dataFixture.application_environment.appver).toBe("1.1.1");
    expect(bugsense.dataFixture.application_environment.osver).toMatch(/Intel Mac OS X|Linux x86_64/);
    expect(bugsense.dataFixture.application_environment.cordova).toBe("unknown");
    expect(bugsense.dataFixture.application_environment.device_name).toBe("unknown");
    expect(bugsense.dataFixture.application_environment.phone).toMatch(/MacIntel|Linux x86_64/);
    expect(Object.keys(bugsense.dataFixture.application_environment.log_data).length).toEqual(0);
  });
});

describe("Bugsense::ExtraData", function(){
  it("should add some initial extra data", function(){
    bugsense.addExtraData( 'user_type', 'CEO' );
    expect(Object.keys(bugsense.extraData).length).toEqual(1);
    expect(bugsense.extraData.user_type).toBe('CEO');
  });
  it("should add other extra data as well", function(){
    bugsense.addExtraData( 'paying', true );
    expect(Object.keys(bugsense.extraData).length).toEqual(2);
    expect(bugsense.extraData.user_type).toBe('CEO');
    expect(bugsense.extraData.paying).toBeTruthy();
  });
  it("should remove the initial extra data added", function(){
    bugsense.removeExtraData( 'user_type' );
    expect(Object.keys(bugsense.extraData).length).toEqual(1);
    expect(bugsense.extraData.user_type).toBeUndefined();
    bugsense.removeExtraData( 'paying' );
    expect(Object.keys(bugsense.extraData).length).toEqual(0);
    expect(bugsense.extraData.paying).toBeUndefined();
  });
  it("should clear all extra data", function(){
    bugsense.addExtraData( 'dev_env', true );
    bugsense.addExtraData( 'project_type', 'insights' );
    expect(Object.keys(bugsense.extraData).length).toEqual(2);
    bugsense.clearExtraData();
    expect(Object.keys(bugsense.extraData).length).toEqual(0);
    expect(bugsense.extraData.dev_env).toBeUndefined();
    expect(bugsense.extraData.project_type).toBeUndefined();
  });
});

describe("Bugsense::Breadcrumbs", function(){
  it("should add some initial breadcrumb", function(){
    bugsense.leaveBreadcrumb( 'button_clicked' );
    expect(bugsense.breadcrumbs.length).toEqual(1);
    expect(bugsense.breadcrumbs[0]).toBe('button_clicked');
  });
  it("should add other breadcrumb as well", function(){
    bugsense.leaveBreadcrumb( 'added_credit_card' );
    expect(bugsense.breadcrumbs.length).toEqual(2);
    expect(bugsense.breadcrumbs[1]).toBe('added_credit_card');
  });
  it("should clear all breadcrumbs", function(){
    expect(bugsense.breadcrumbs.length).toEqual(2);
    bugsense.clearBreadcrumbs();
    expect(bugsense.breadcrumbs.length).toBe(0);
    expect(bugsense.breadcrumbs[0]).toBeUndefined();
    expect(bugsense.breadcrumbs[1]).toBeUndefined();
  });
  it("should add other breadcrumb after clearing all breadcrumbs", function(){
    bugsense.leaveBreadcrumb( 'after_clearing' );
    expect(bugsense.breadcrumbs.length).toEqual(1);
    expect(bugsense.breadcrumbs[0]).toBe('after_clearing');
  });
});

describe('Bugsense::Send Data', function () {
  beforeEach(function(){
    server = sinon.fakeServer.create();
  });
  afterEach(function(){
    server.restore();
  });
  it("should successfully to a request", function(){
    bugsense.send({name: 'Test Name', apiKey: bugsense.config.apiKey}, 'POST');
    expect(server.requests[0].requestHeaders['Content-Type']).toBe('application/x-www-form-urlencoded;charset=utf-8');
    expect(server.requests[0].method).toBe('POST');
    server.requests[0].respond(
        200,
        { "Content-Type": "application/json" },
        'OK');
    bugsense.send({name: 'Test Name', apiKey: bugsense.config.apiKey}, 'DELETE');
    expect(server.requests[1].method).toBe('DELETE');
    server.requests[1].respond(
        200,
        { "Content-Type": "application/json" },
        'OK');
  });
});

describe('Bugsense::Event Listeners', function () {
  it("should add an event with `on` function", function(){
    bugsense.on('crashed', function(){ window.CRASHED = 1; });
    bugsense.trigger('crashed');
    expect(bugsense._events).toBeDefined();
    expect(bugsense._events.crashed).toBeDefined();
    expect(bugsense._events.crashed.length).toEqual(1);
    expect(window.CRASHED).toEqual(1);
  });
  it("should add an event with `once` function", function(){
    bugsense.once('crashed:once', function() { window.CRASHED +=1; })
    expect(bugsense._events).toBeDefined();
    expect(bugsense._events['crashed:once']).toBeDefined();
    expect(bugsense._events['crashed:once'].length).toEqual(1);
    bugsense.trigger('crashed:once');
    expect(window.CRASHED).toEqual(2);
    bugsense.trigger('crashed');
    expect(window.CRASHED).toEqual(1);
  });
  it("should remove an event with `off` function", function(){
    bugsense.off('crashed');
    bugsense.trigger('crashed');
    expect(bugsense._events.crashed).toBeUndefined();
    expect(window.CRASHED).toEqual(1);
  });
});

describe("Bugsense::Parsing Error", function(){
  it("parse an error correctly", function(){
    var error = {
      "name": "Error",
      "fileName":"file:///Users/dtsironis/Spl/bugsense.js/specs/build/specs.js",
      "lineNumber":102,
      "columnNumber": 4,
      "message": 'a is not a variable',
      "stack":"@file:///Users/dtsironis@file:///Users/dtsironis/Spl/bugsense.js/.grunt/grunt-contrib-jasmine/jasmine.js:2106\njasmine.Queue.prototype.next_/onComplete/<@file:///Users/dtsironis/Spl/bugsense.js/.grunt/grunt-contrib-jasmine/jasmine.js:2086\n"
    }
    window.parsedError = bugsense.parseError(error);
    if (window.navigator.userAgent.match(/Firefox/))
      expect(parsedError.message).toBe('a is not a variable');
    else
      expect(parsedError.message).toBe('Error: a is not a variable');
  });
});

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

describe("Bugsense::Notify server", function(){
});

describe("Bugsense::Cache failed reports", function(){
  it("should cache a failed report", function(){
    expect(bugsense.queue.length).toEqual(0);
    bugsense.cacheReport({"client":{"name":"bugsense-js","version":"1.1"},"request":{},"exception":{"message":"message","where":":","klass":"message","backtrace":"message","breadcrumbs":["after_clearing"]},"application_environment":{"phone":"MacIntel","appver":"unknown","appname":"unknown","osver":"Intel Mac OS X 10.8","connection_type":"unknown","user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:25.0) Gecko/20100101 Firefox/25.0","cordova":"unknown","device_name":"unknown","log_data":{}}});
    expect(bugsense.queue.length).toEqual(1);
  });
  it("should save the cached report in the localStorage", function(){
    expect(localStorage.getItem('bugsense_cache')).toBe('[{"client":{"name":"bugsense-js","version":"1.1"},"request":{},"exception":{"message":"message","where":":","klass":"message","backtrace":"message","breadcrumbs":["after_clearing"]},"application_environment":{"phone":"MacIntel","appver":"unknown","appname":"unknown","osver":"Intel Mac OS X 10.8","connection_type":"unknown","user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:25.0) Gecko/20100101 Firefox/25.0","cordova":"unknown","device_name":"unknown","log_data":{}}}]');
  });
  it("should update cache when an additional report is getting cached", function(){
    bugsense.cacheReport({"client":{"name":"bugsense-js","version":"1.1"},"request":{},"exception":{"message":"message","where":":","klass":"message","backtrace":"message","breadcrumbs":["after_clearing"]},"application_environment":{"phone":"MacIntel","appver":"unknown","appname":"unknown","osver":"Intel Mac OS X 10.8","connection_type":"unknown","user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:25.0) Gecko/20100101 Firefox/25.0","cordova":"unknown","device_name":"unknown","log_data":{}}});
    expect(bugsense.queue.length).toEqual(2);
    expect(localStorage.getItem('bugsense_cache')).toBe('[{"client":{"name":"bugsense-js","version":"1.1"},"request":{},"exception":{"message":"message","where":":","klass":"message","backtrace":"message","breadcrumbs":["after_clearing"]},"application_environment":{"phone":"MacIntel","appver":"unknown","appname":"unknown","osver":"Intel Mac OS X 10.8","connection_type":"unknown","user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:25.0) Gecko/20100101 Firefox/25.0","cordova":"unknown","device_name":"unknown","log_data":{}}},{"client":{"name":"bugsense-js","version":"1.1"},"request":{},"exception":{"message":"message","where":":","klass":"message","backtrace":"message","breadcrumbs":["after_clearing"]},"application_environment":{"phone":"MacIntel","appver":"unknown","appname":"unknown","osver":"Intel Mac OS X 10.8","connection_type":"unknown","user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:25.0) Gecko/20100101 Firefox/25.0","cordova":"unknown","device_name":"unknown","log_data":{}}}]');
  });
});

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
