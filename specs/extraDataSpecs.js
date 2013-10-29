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
});
