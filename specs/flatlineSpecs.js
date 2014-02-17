describe('Bugsense::Flatline', function() {
  it('should create a valid flatline', function() {
    var flatline = Bugsense.Sessions.createFlatline('_ping').split(':');
    expect(flatline[0]).toEqual('2.0.1');
    expect(flatline[1]).toEqual('_ping');
    expect(flatline[2]).toEqual('unknown');
    expect(flatline[3]).toEqual('unknown');
    expect(flatline[4]).toMatch(/Linux|Intel Mac OS X/);
    expect(flatline[5]).toEqual('1.1.1');
    expect(flatline[6]).toEqual('unknown');
    expect(flatline[7]).toMatch(/[0-9]{10}/);
  });
});
