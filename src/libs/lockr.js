(function() {
  this.Lockr = {};

  Lockr.set = function (key, value) {
    localStorage.setItem(key, value);
  };

  Lockr.hset = function (key, hashObj) {
    localStorage.setItem(key, JSON.stringify(hashObj));
  };
  Lockr.get = function (key, callback) {
    var value = localStorage.getItem(key);
    if (!value) return undefined;
    if (value.match(/[\{\}\:\[\]]/))
      return JSON.parse(value);
    else
      return value;
  };

  Lockr.getAll = function () {
    var keys = Object.keys(localStorage);

    return keys.map(function (key) {
      return Lockr.get(key);
    });
  };

  Lockr.flush = function () {
    localStorage.clear();
  };
  return Lockr;

}).call(this);
