Bugsense.Network = (function() {

  var Network = {
    getCrashURL: function(type) {
      return Bugsense.config.url + '?cacheBuster='+timestamp();
    },
    getTicksURL: function() {
      return "https://ticks.bugsense.com/"+Bugsense.get('apiKey')+"/"+Bugsense.get('uid');
    },
    sendCrash: function(data) {
      this.send(data, 'POST', this.getCrashURL())
    },
    sendEvent: function(data) {
      this.send(data, 'POST', this.getTicksURL())
    },
    send: function(data, method, url) {
      // Send the data over to Bugsense
      var net = new XMLHttpRequest();
      net.open(method, url, true );
      net.setRequestHeader('X-BugSense-Api-Key', Bugsense.config.apiKey);
      net.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      var that = this;
      net.onerror = function (a) {
        /* cache the report */
        that.cache(data);
      }
      function successHandler() {
        if (net && net.readyState != 4) { return; }
        if (net && net.status != 200) {
          return false;
        }
        // some console.log implementations don't support multiple parameters, guess it's okay in this case to concatenate
        if ('console' in window) {
          console.log('logged 1 error to Bugsense, status: ' + net.responseText);
        }
      };

      net.onreadystatechange = successHandler;
      net.send(param({ data: JSON.stringify(data) }));
    }
  };
  return Network;
}());
