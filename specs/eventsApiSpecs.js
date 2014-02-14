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
