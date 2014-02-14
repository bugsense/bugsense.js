describe("Bugsense::Notify server", function(){
  beforeEach(function() {
    server = sinon.fakeServer.create();
  });
  afterEach(function() {
    server.restore();
  });
  it('should catch a handled error with try...catch', function() {
    var response;
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
  });
});
