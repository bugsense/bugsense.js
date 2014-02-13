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
    expect(parsedError.custom_data).toBeUndefined();
    expect(parsedError.line).toEqual(102);
    expect(parsedError.url).toBe('file:///Users/dtsironis/Spl/bugsense.js/specs/build/specs.js');
  });
});

describe("Bugsense::Notify server", function(){
  beforeEach(function() {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = function (req) { requests.push(req); };
  });
  afterEach(function() {
    xhr.restore();
  });
  it('should catch a handled error with try...catch', function() {
    var response;
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = function (req) { requests.push(req); };
    try {
      dontpanic++;
    } catch (e) {
      /* handle error */
      // Bugsense.notify(e);
      response = Bugsense.notify(e, {'rotation': 'not supported'});
    }
    expect(response).toBeTruthy();

    var req = requests[requests.length - 1]
    var url = req.url.split('=');

    /* Testing url */
    expect(url[0]).toBe('https://www.bugsense.com/api/errors?cacheBuster');
    expect(url[1]).toMatch(/\d/);

    /* Request headers */
    expect(req.requestHeaders['X-BugSense-Api-Key']).toEqual('FOOBAR');
    expect(req.requestHeaders['Content-Type']).toEqual('application/x-www-form-urlencoded;charset=utf-8');

    var body = JSON.parse(decodeURIComponent(req.requestBody).replace('data=',''));
    expect(body.exception.where).toEqual('http://localhost:7000/specs/build/specs.js:116');
    expect(body.exception.klass).toEqual('unknown');
    expect(body.application_environment.user_agent).toMatch(/Firefox|Chrome|PhantomJS 1.9.7/);
    expect(body.application_environment.osver).toMatch(/Intel Mac OS X|Linux x86_64/);
    expect(body.exception.breadcrumbs.length).toEqual(1);

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
