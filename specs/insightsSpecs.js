describe('Bugsense::Insights', function() {
  beforeEach(function () {
    server = sinon.fakeServer.create();
  });
  afterEach(function () {
    server.restore();
  });
  it('should send a ping successfully', function() {
    Bugsense.Sessions.ping();
    server.requests[0].respond(
      200,
      { "Content-Type": "application/text-plain" },
      "ok"
    );
    var flatline = decodeURIComponent(server.requests[0].requestBody).replace('"', '', "gi").split(':');
    expect(flatline[0]).toBe("2.0.1");
    expect(flatline[1]).toBe("_ping");
    expect(flatline[2]).toBe("unknown");
    expect(flatline[3]).toBe("unknown");
    expect(flatline[4]).toMatch(/Intel Mac OS X|Linux/);
    expect(flatline[5]).toBe("1.1.1");
    expect(flatline[6]).toBe("unknown");
    expect(flatline[7]).toMatch(/[0-9]{10}/);
  });
  it('should have correct URL arguments', function() {
    Bugsense.Sessions.ping();
    server.requests[0].respond(
      200,
      { "Content-Type": "application/text-plain" },
      "ok"
    );
    expect(server.requests[0].url).toBe('https://ticks.bugsense.com/'+Bugsense.config.apiKey+'/'+Bugsense.config.uid);
    expect(server.requests[0].method).toBe('POST');
  });
  it('should send an event successfully', function() {
    Bugsense.Sessions.event('button_clicked');
    server.requests[0].respond(
      200,
      { "Content-Type": "application/text-plain" },
      "ok"
    );
    var flatline = decodeURIComponent(server.requests[0].requestBody).replace('"', '', "gi").split(':');
    expect(flatline[0]).toBe("2.0.1");
    expect(flatline[1]).toBe("button_clicked");
    expect(flatline[2]).toBe("unknown");
    expect(flatline[3]).toBe("unknown");
    expect(flatline[4]).toMatch(/Intel Mac OS X|Linux/);
    expect(flatline[5]).toBe("1.1.1");
    expect(flatline[6]).toBe("unknown");
    expect(flatline[7]).toMatch(/[0-9]{10}/);
  });
});
