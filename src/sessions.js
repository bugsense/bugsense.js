Bugsense.Sessions = (function () {
  var generator = function GUIDGenerator() {
    var S4 = function () {
      return Math.floor(
        Math.random() * 0x10000 /* 65536 */
      ).toString(16);
    };
    return (
      S4() + S4() + "-" +
      S4() + "-" +
      S4() + "-" +
      S4() + "-" +
      S4() + S4() + S4()
    );
  }

  var Sessions = {
    generateUid: function() {
      var uid = Lockr.get('bugsense:uid') || generator();
      Lockr.set('bugsense:uid', uid);
      return uid;
    },
    createFlatline: function(type) {
      var data = [];
      data.push(Bugsense.get('VERSION'));
      data.push(Bugsense.get('device'));
      data.push(Bugsense.get('manufacturer'));
      data.push(Bugsense.get('osver'));
      data.push(Bugsense.get('appver'));
      data.push(Bugsense.get('country'));
      data.push(timestamp());
      return data.join(':');
    }
  };

  return Sessions;
}());
