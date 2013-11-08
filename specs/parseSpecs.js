describe("Bugsense::Parsing Error", function(){
  it("parse an error correctly", function(){
    var error = {
      "name": "Error",
      "fileName":"file:///Users/dtsironis/Spl/bugsense.js/specs/build/specs.js",
      "lineNumber":102,
      "columnNumber": 4,
      "message": 'a is not a variable',
      "stack":"@file:///Users/dtsironis@file:///Users/dtsironis/Spl/bugsense.js/.grunt/grunt-contrib-jasmine/jasmine.js:2106\njasmine.Queue.prototype.next_/onComplete/<@file:///Users/dtsironis/Spl/bugsense.js/.grunt/grunt-contrib-jasmine/jasmine.js:2086\n"
    }
    window.parsedError = bugsense.parseError(error);
    expect(parsedError.message).toBe('Error: a is not a variable');
  });
});
