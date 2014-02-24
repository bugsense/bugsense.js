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
    expect(typeof(Bugsense.Network.getPostURL)).toBe('function');
    expect(typeof(Bugsense.leaveBreadcrumb)).toBe('function');
    expect(typeof(Bugsense.notify)).toBe('function');
    expect(typeof(Bugsense.Errors.parse)).toBe('function');
    expect(typeof(Bugsense.removeExtraData)).toBe('function');
    expect(typeof(Bugsense.Cache.sendCachedReport)).toBe('function');
    expect(typeof(Bugsense.Cache.update)).toBe('function');
    expect(typeof(Bugsense.Cache.cacheReport)).toBe('function');
    expect(typeof(Bugsense.Cache.retrieve)).toBe('function');
  });
})
describe('Bugsense::Configuration', function () {
  it('should have correct default attributes',function () {
    expect(Bugsense.config.url).toBe('https://www.bugsense.com/api/errors');
    expect(Bugsense.config.apiKey).toBe('FOOBAR');
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
});
describe('Bugsense::Unique ID', function() {
  it("should have a retain a saved uid", function(){
    // write expectations
    expect(Bugsense.config.uid).toBeNull();
  });

  it("should generate a correct uid", function(){
    // write expectations
    localStorage.clear();
    expect(Bugsense.Sessions.generateUid()).toMatch(new RegExp(/([a-f0-9\-])+/));
    expect(localStorage.getItem('bugsense:uid')).toMatch(new RegExp(/([a-f0-9\-])+/));
  });
});
xdescribe('Bugsense::Data fixture', function () {
  it("should have correct data fixture", function(){
    expect(bugsense.config.VERSION).toBe('2.0.1');
    expect(bugsense.dataFixture.client.name).toBe("bugsense-js");
    expect(bugsense.dataFixture.client.version).toBe("2.0.1");
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
    Bugsense.addExtraData( 'user_type', 'CEO' );
    expect(Object.keys(Bugsense.extraData).length).toEqual(1);
    expect(Bugsense.extraData.user_type).toBe('CEO');
  });
  it("should add other extra data as well", function(){
    Bugsense.addExtraData( 'paying', true );
    expect(Object.keys(Bugsense.extraData).length).toEqual(2);
    expect(Bugsense.extraData.user_type).toBe('CEO');
    expect(Bugsense.extraData.paying).toBeTruthy();
  });
  it("should remove the initial extra data added", function(){
    Bugsense.removeExtraData( 'user_type' );
    expect(Object.keys(Bugsense.extraData).length).toEqual(1);
    expect(Bugsense.extraData.user_type).toBeUndefined();
    Bugsense.removeExtraData( 'paying' );
    expect(Object.keys(Bugsense.extraData).length).toEqual(0);
    expect(Bugsense.extraData.paying).toBeUndefined();
  });
  it("should clear all extra data", function(){
    Bugsense.addExtraData( 'dev_env', true );
    Bugsense.addExtraData( 'project_type', 'insights' );
    expect(Object.keys(Bugsense.extraData).length).toEqual(2);
    Bugsense.clearExtraData();
    expect(Object.keys(Bugsense.extraData).length).toEqual(0);
    expect(Bugsense.extraData.dev_env).toBeUndefined();
    expect(Bugsense.extraData.project_type).toBeUndefined();
  });
});

describe("Bugsense::Breadcrumbs", function(){
  it("should add some initial breadcrumb", function(){
    Bugsense.leaveBreadcrumb( 'button_clicked' );
    expect(Bugsense.breadcrumbs.length).toEqual(1);
    expect(Bugsense.breadcrumbs[0]).toBe('button_clicked');
  });
  it("should add other breadcrumb as well", function(){
    Bugsense.leaveBreadcrumb( 'added_credit_card' );
    expect(Bugsense.breadcrumbs.length).toEqual(2);
    expect(Bugsense.breadcrumbs[1]).toBe('added_credit_card');
  });
  it("should clear all breadcrumbs", function(){
    expect(Bugsense.breadcrumbs.length).toEqual(2);
    Bugsense.clearBreadcrumbs();
    expect(Bugsense.breadcrumbs.length).toBe(0);
    expect(Bugsense.breadcrumbs[0]).toBeUndefined();
    expect(Bugsense.breadcrumbs[1]).toBeUndefined();
  });
  it("should add other breadcrumb after clearing all breadcrumbs", function(){
    Bugsense.leaveBreadcrumb( 'after_clearing' );
    expect(Bugsense.breadcrumbs.length).toEqual(1);
    expect(Bugsense.breadcrumbs[0]).toBe('after_clearing');
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
    Bugsense.Network.send({name: 'Test Name', apiKey: Bugsense.config.apiKey}, 'POST');
    expect(server.requests[0].requestHeaders['Content-Type']).toBe('application/x-www-form-urlencoded;charset=utf-8');
    expect(server.requests[0].method).toBe('POST');
    server.requests[0].respond(
        200,
        { "Content-Type": "application/json" },
        'OK');
    Bugsense.Network.send({name: 'Test Name', apiKey: Bugsense.config.apiKey}, 'DELETE');
    expect(server.requests[1].method).toBe('DELETE');
    server.requests[1].respond(
        200,
        { "Content-Type": "application/json" },
        'OK');
  });
});

describe('Bugsense::Event Listeners', function () {
  it("should add an event with `on` function", function(){
    Bugsense.on('crashed', function(){ window.CRASHED = 1; });
    Bugsense.trigger('crashed');
    expect(Bugsense._events).toBeDefined();
    expect(Bugsense._events.crashed).toBeDefined();
    expect(Bugsense._events.crashed.length).toEqual(1);
    expect(window.CRASHED).toEqual(1);
  });
  it("should add an event with `once` function", function(){
    Bugsense.once('crashed:once', function() { window.CRASHED +=1; })
    expect(Bugsense._events).toBeDefined();
    expect(Bugsense._events['crashed:once']).toBeDefined();
    expect(Bugsense._events['crashed:once'].length).toEqual(1);
    Bugsense.trigger('crashed:once');
    expect(window.CRASHED).toEqual(2);
    Bugsense.trigger('crashed');
    expect(window.CRASHED).toEqual(1);
  });
  it("should remove an event with `off` function", function(){
    Bugsense.off('crashed');
    Bugsense.trigger('crashed');
    expect(Bugsense._events.crashed).toBeUndefined();
    expect(window.CRASHED).toEqual(1);
  });
});

describe("Bugsense::Parsing Error", function(){
  it("parse an error correctly", function(){
    var error = {
      "url":"file:///Users/dtsironis/Spl/bugsense.js/specs/build/specs.js",
      "line":102,
      "column": 4,
      "exception": 'a is not a variable',
      "stack":"@file:///Users/dtsironis@file:///Users/dtsironis/Spl/bugsense.js/.grunt/grunt-contrib-jasmine/jasmine.js:2106\njasmine.Queue.prototype.next_/onComplete/<@file:///Users/dtsironis/Spl/bugsense.js/.grunt/grunt-contrib-jasmine/jasmine.js:2086\n"
    };
    window.parsedError = Bugsense.Errors.parse(error);
    expect(parsedError.message).toBe('a is not a variable');
    expect(parsedError.custom_data).toEqual({});
    expect(parsedError.line).toEqual(102);
    expect(parsedError.url).toBe('file:///Users/dtsironis/Spl/bugsense.js/specs/build/specs.js');
  });
});

describe("Busense::Generate Exception Data", function(){
  //it should do sth
  beforeEach(function () {
    var error = {
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
    expect(data.client.version).toBe('2.0.1');
  });
  it("should generate a valid crash fixture (exception)", function () {
    expect(Object.keys(data.exception).length).toEqual(5);
    expect(data.request.user_id).toBe('tsironis');
    expect(data.exception.message).toBe("Can't find variable: dontpanic");
    expect(data.exception.where).toMatch(/http:\/\/localhost:7000\/specs\/build\/specs.js/);
    expect(data.exception.breadcrumbs.length).toEqual(1);
  });
  it("should generate a valid crash fixture (app environment)", function () {
    expect(data.exception.breadcrumbs[0]).toBe('after_clearing');
    expect(Object.keys(data.application_environment).length).toEqual(8);
    expect(data.application_environment.phone).toMatch(/MacIntel|Linux x86_64/);
    expect(data.application_environment.appver).toBe('1.1.1');
    expect(data.application_environment.osver).toMatch(/Intel Mac OS X|Linux x86_64/);
    expect(data.application_environment.appname).toBe('theApp');
    expect(data.application_environment.user_agent).toMatch(/Firefox|Chrome|PhantomJS 1.9.7/)
    expect(data.application_environment.cordova).toBe('unknown');
    expect(data.application_environment.device_name).toBe('unknown');
    expect(Object.keys(data.application_environment.log_data).length).toEqual(1);
  });
  it("should generate a valid backtrace", function(){
    // write expectations
    expect(data.exception.backtrace.length).toEqual(11);
  });
});

describe("Bugsense::Notify server", function(){
  beforeEach(function() {
    server = sinon.fakeServer.create();
  });
  afterEach(function() {
    server.restore();
  });
  it('should catch a handled error with try...catch', function() {
    var response;
    Bugsense.addExtraData('testing', 'hey-oh');
    try {
      dontpanic++;
    } catch (e) {
      /* handle error */
      // Bugsense.notify(e);
      response = Bugsense.notify(e, {'rotation': 'not supported'});
    }
    server.requests[0].respond(
        200,
        { "Content-Type": "application/json" },
        JSON.stringify({eid: '123123123'})
    );
    expect(response).toBeTruthy();

    var req = server.requests[0]
    var url = req.url.split('=');

    /* Testing url */
    expect(url[0]).toBe('https://www.bugsense.com/api/errors?cacheBuster');
    expect(url[1]).toMatch(/\d/);

    // /* Request headers */
    expect(req.requestHeaders['X-BugSense-Api-Key']).toEqual('8a581d8a');
    expect(req.requestHeaders['Content-Type']).toEqual('application/x-www-form-urlencoded;charset=utf-8');

    var body = JSON.parse(decodeURIComponent(req.requestBody).replace('data=',''));
    expect(body.application_environment.user_agent).toMatch(/Firefox|Chrome|PhantomJS 1.9.7/);
    expect(body.application_environment.osver).toMatch(/Intel Mac OS X|Linux x86_64/);
    expect(body.exception.breadcrumbs.length).toEqual(1);
    expect(body.application_environment.log_data.testing).toBe("hey-oh");
    expect(body.application_environment.log_data.rotation).toBe("not supported");
  });
});

describe("Bugsense::Cache failed reports", function(){
  it("should cache a failed report", function(){
    expect(Bugsense.Cache._queue.length).toEqual(0);
    Bugsense.Cache.cacheReport({"client":{"name":"bugsense-js","version":"1.1"},"request":{},"exception":{"message":"message","where":":","klass":"message","backtrace":"message","breadcrumbs":["after_clearing"]},"application_environment":{"phone":"MacIntel","appver":"unknown","appname":"unknown","osver":"Intel Mac OS X 10.8","connection_type":"unknown","user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:25.0) Gecko/20100101 Firefox/25.0","cordova":"unknown","device_name":"unknown","log_data":{}}});
    expect(Bugsense.Cache._queue.length).toEqual(1);
  });
  it("should save the cached report in the localStorage", function(){
    expect(localStorage.getItem('bugsense_cache')).toBe('[{"client":{"name":"bugsense-js","version":"1.1"},"request":{},"exception":{"message":"message","where":":","klass":"message","backtrace":"message","breadcrumbs":["after_clearing"]},"application_environment":{"phone":"MacIntel","appver":"unknown","appname":"unknown","osver":"Intel Mac OS X 10.8","connection_type":"unknown","user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:25.0) Gecko/20100101 Firefox/25.0","cordova":"unknown","device_name":"unknown","log_data":{}}}]');
  });
  it("should update cache when an additional report is getting cached", function(){
    Bugsense.Cache.cacheReport({"client":{"name":"bugsense-js","version":"1.1"},"request":{},"exception":{"message":"message","where":":","klass":"message","backtrace":"message","breadcrumbs":["after_clearing"]},"application_environment":{"phone":"MacIntel","appver":"unknown","appname":"unknown","osver":"Intel Mac OS X 10.8","connection_type":"unknown","user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:25.0) Gecko/20100101 Firefox/25.0","cordova":"unknown","device_name":"unknown","log_data":{}}});
    expect(Bugsense.Cache._queue.length).toEqual(2);
    expect(localStorage.getItem('bugsense_cache')).toBe('[{"client":{"name":"bugsense-js","version":"1.1"},"request":{},"exception":{"message":"message","where":":","klass":"message","backtrace":"message","breadcrumbs":["after_clearing"]},"application_environment":{"phone":"MacIntel","appver":"unknown","appname":"unknown","osver":"Intel Mac OS X 10.8","connection_type":"unknown","user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:25.0) Gecko/20100101 Firefox/25.0","cordova":"unknown","device_name":"unknown","log_data":{}}},{"client":{"name":"bugsense-js","version":"1.1"},"request":{},"exception":{"message":"message","where":":","klass":"message","backtrace":"message","breadcrumbs":["after_clearing"]},"application_environment":{"phone":"MacIntel","appver":"unknown","appname":"unknown","osver":"Intel Mac OS X 10.8","connection_type":"unknown","user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:25.0) Gecko/20100101 Firefox/25.0","cordova":"unknown","device_name":"unknown","log_data":{}}}]');
  });
});

describe("Bugsense::Error Hash", function(){
  beforeEach(function () {
    hash = Bugsense.Errors.computeErrorHash('var a = b;', 'b is not defined', 8, 'example', '1.2.3');
  });
  it("should generate a 32-digit md5 errorHash", function(){
    var hash = Bugsense.Errors.computeErrorHash('var a = b;', 'b is not defined', 8, 'example', '1.2.3');
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
    var new_hash = Bugsense.Errors.computeErrorHash('var a = c;', 'c is undefined', 8, 'example', '1.2.3');
    expect(new_hash).not.toBe(hash);
  });

});
