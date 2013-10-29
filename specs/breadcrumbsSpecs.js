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
