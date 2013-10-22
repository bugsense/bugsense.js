describe("Bugsense::ExtraData", function(){
  it("should add extra data correctly", function(){
    bugsense.addExtraData( 'user_type', 'CEO' );
    expect(bugsense.extraData.length).not.toEqual(0);
    expect(bugsense.extraData.user_type).toBe('CEO');
  });
});
