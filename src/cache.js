Bugsense.Cache = (function() {
  var Cache = {
    _queue: [],
    cacheReport: function(data) {
      this._queue.push(data);
      this.update();
    },
    retrieve: function () {
      var data = Lockr.get('bugsense_cache');
      this._queue = data || [];
      if (this._queue.length)
        this.sendCachedReport();
    },
    update: function () {
      Lockr.set('bugsense_cache', this._queue);
    },
    sendCachedReport: function() {
      // do stuff here
      if(this._queue.length) {
        var that = this;
        each(this._queue, function(data, index) {
          Bugsense.Network.send(data, 'POST');
          that._queue.shift(index);
        });
        this.update();
      } else {
        return false;
      }
    }
  };

  return Cache;
}());
