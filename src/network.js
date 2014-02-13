Bugsense.Network = (function() {
  var Network = {
    getPostURL: function( type ) {
      return Bugsense.config.url + '?cacheBuster='+timestamp();
    },
    send: function(data, method) {
      // Send the data over to Bugsense
      var request = new XMLHttpRequest();
      request.open(method, this.getPostURL(), true );
      request.setRequestHeader('X-BugSense-Api-Key', Bugsense.config.apiKey);
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      var that = this;
      request.onerror = function (a) {
        /* cache the report */
        that.cacheReport(data);
      }
      request.onreadystatechange = this.successHandler;
      request.send(param({ data: JSON.stringify(data) }));
    }
  };
  return Network;
}());
