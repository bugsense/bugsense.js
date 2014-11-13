Bugsense.Network = (function() {

  var Network = {
    getPostURL: function() {
      return Bugsense.config.url + '?cacheBuster=' + timestamp();
    },
    send: function(data, method) {
      // Send the data over to Bugsense
      var net = new XMLHttpRequest();
      net.open(method, this.getPostURL(), true );
      net.setRequestHeader('X-BugSense-Api-Key', Bugsense.config.apiKey);
      net.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      net.onerror = function () {
        /* cache the report */
        Bugsense.Cache.cacheReport(data);
      }
      function successHandler() {
        if (net && net.readyState != 4) { return; }
        if (net && net.status != 200) {
          return false;
        }
        // some console.log implementations don't support multiple parameters, guess it's okay in this case to concatenate
        if ('console' in window && !Bugsense.config.silent) {
          console.log('logged 1 error to Bugsense, status: ' + net.responseText);
        }
      };

      net.onreadystatechange = successHandler;
      net.send(param({ data: JSON.stringify(data) }));
    }
  };
  return Network;
}());
