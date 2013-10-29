describe('Bugsense plugin instance', function  () {
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
    expect(typeof(Bugsense.prototype.send_cached_report_if_any)).toBe('function');
    expect(typeof(Bugsense.prototype.successHandler)).toBe('function');
    expect(typeof(Bugsense.prototype.testException)).toBe('function');
  });
})
describe('Bugsense configuration', function () {
  it('should have correct default attributes',function () {
    expect(Bugsense.prototype.config.url).toBe("https://www.bugsense.com/api/errors");
    expect(Bugsense.prototype.config.apiKey).toBe('FOOBAR');
    expect(Bugsense.prototype.config.apiKey).toBe('FOOBAR');
    expect(Bugsense.prototype.config.pingUrl).toBe('http://ticks2.bugsense.com/api/ticks');
    expect(Bugsense.prototype.config.winjs).toBeFalsy();
    expect(Bugsense.prototype.config.winjs).toBeFalsy();
    expect(Bugsense.prototype.config.message).toBeNull();
    expect(Bugsense.prototype.config.callback).toBeNull();
    expect(Bugsense.prototype.config.appversion).toBeNull();
  });
  it("should change correctly an attribute", function(){
    window.bugsense = new Bugsense({apiKey: "8a581d8a"});
    expect(Bugsense.prototype.config.apiKey).not.toBe('FOOBAR');
    expect(bugsense.config.apiKey).toBe("8a581d8a");
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
