Bugsense.Network = (function() {


  var successHandler = function(request) {
    console.log('lalala')
    if (request.target && request.target.readyState != 4) { return; }
    if (request.target && request.target.status != 200) {
      return false;
    }
    // some console.log implementations don't support multiple parameters, guess it's okay in this case to concatenate
    if ('console' in window) {
      console.log('logged 1 error to Bugsense, status: ' + request.target.responseText);
    }
  };
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
