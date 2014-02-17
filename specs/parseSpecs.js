describe("Bugsense::Parsing Error", function(){
  it("parse an error correctly", function(){
    var error = {
      "url":"file:///Users/dtsironis/Spl/bugsense.js/specs/build/specs.js",
      "line":102,
      "column": 4,
      "exception": 'a is not a variable',
      "stack":"@file:///Users/dtsironis@file:///Users/dtsironis/Spl/bugsense.js/.grunt/grunt-contrib-jasmine/jasmine.js:2106\njasmine.Queue.prototype.next_/onComplete/<@file:///Users/dtsironis/Spl/bugsense.js/.grunt/grunt-contrib-jasmine/jasmine.js:2086\n",
      "handled": false
    };
    window.parsedError = Bugsense.Errors.parse(error);
    expect(parsedError.message).toBe('a is not a variable');
    expect(parsedError.custom_data).toBeUndefined();
    expect(parsedError.line).toEqual(102);
    expect(parsedError.url).toBe('file:///Users/dtsironis/Spl/bugsense.js/specs/build/specs.js');
    expect(parsedError.handled).toBeFalsy();
  });
});
