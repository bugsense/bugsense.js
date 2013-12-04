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
