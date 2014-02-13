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
