window.Bugsense = (function(){

  var config = {
    apiKey: null,
    message: null,
    uid: null,
    userIdentifier: null,
    appver: null,
    appname: null,
    osver: null,
    url: 'https://www.bugsense.com/api/errors',
    context: window
  };

  var initAndStartSession = function(options) {
    config = extend(config, options);
    // starting session
  };

  var generateFixture = function() {
    var ua = window.navigator.userAgent;
    return {
      client: {
        'name' : 'bugsense-js',
        'version' : '2.0.1'
      },
      request: {
        'user_id': (Bugsense.config.userIdentifier || 'unknown'),
      },
      exception: {
        'message' : null,
        'where' : null,
        'klass' : null,
        'backtrace' : null,
        'breadcrumbs': null
      },
      application_environment: {
        'phone': window.navigator.platform,
        'appver': (Bugsense.config.appver || 'unknown'),
        'appname': (Bugsense.config.appname || 'unknown'),
        'osver': (typeof window.device !== 'undefined')
          ? window.device.version
          : ua.substr(ua.indexOf('; ')+2,ua.length).replace(')',';').split(';')[0] || 'unknown',
        'user_agent' : bowser.name+" "+bowser.version,
        'cordova' : (typeof window.device !== 'undefined') ? window.device.cordova : 'unknown',
        'device_name' : (typeof window.device !== 'undefined') ? window.device.name : 'unknown',
        'log_data' : {}
      }
    };
  }

  return {
    config: config,
    initAndStartSession: initAndStartSession,
    generateFixture: generateFixture
  }
}());
