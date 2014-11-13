window.Bugsense = (function(){

  var config = {
    apiKey: null,
    message: null,
    uid: null,
    userIdentifier: null,
    appVersion: null,
    appname: null,
    osver: null,
    url: 'https://mint.splunk.com/api/errors',
    disableOnError: false,
    silent: false,
    context: window
  };

  var initAndStartSession = function(options) {
    if(options.appver) {
      options.appVersion = options.appver;
      delete options.appver;
    }
    config = extend(config, options);
  };

  var generateFixture = function() {
    var ua = window.navigator.userAgent;
    return {
      client: {
        'name' : 'bugsense-js',
        'version' : '2.2.0'
      },
      request: {
        'user_id': undefined,
        'handled': 0,
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
        'appver': (Bugsense.config.appVersion || 'unknown'),
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
