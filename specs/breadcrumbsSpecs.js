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
