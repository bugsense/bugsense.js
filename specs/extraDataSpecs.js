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
