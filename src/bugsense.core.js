window.Bugsense = (function(){

  var ua = window.navigator.userAgent;
  var config = {
    VERSION: '2.0.1',
    apiKey: 'FOOBAR',
    message: null,
    uid: null,
    userIdentifier: null,
    appver: null,
    appname: null,
    osver: (typeof window.device !== 'undefined')
            ? window.device.version
            : ua.substr(ua.indexOf('; ')+2,ua.length).replace(')',';').split(';')[0] || 'unknown',
    url: 'https://www.bugsense.com/api/errors',
    device: (typeof window.device !== 'undefined') ? window.device.name : 'unknown',
    context: window
  };

  var initAndStartSession = function(options) {
    config = extend(config, options);
    // starting session
  };

  var get = function(attribute) {
    return Bugsense.config[attribute] || 'unknown';
  };

  var generateFixture = function() {
    var fixture = {
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
        'appver': get('appver'),
        'appname': get('appname'),
        'osver': get('osver'),
        'user_agent' : bowser.name+" "+bowser.version,
        'cordova' : (typeof window.device !== 'undefined') ? window.device.cordova : 'unknown',
        'device_name' : get('device'),
        'log_data' : {}
      }
    };
    return fixture;
  }

  return {
    config: config,
    get: get,
    initAndStartSession: initAndStartSession,
    generateFixture: generateFixture
  }
}());
