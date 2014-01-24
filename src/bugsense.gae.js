extend(Bugsense.prototype, {
  generateDataFixture: function () {
    var ua = window.navigator.userAgent;
    return {
      client: {
        'name' : 'bugsense-js',
        'version' : ( this.config.VERSION || 'unknown' )
      },
      request: {
        'custom_data' : [],
        'handled': 0
      },
      exception: {
        'message' : null,
        'where' : null,
        'klass' : null,
        'backtrace' : null,
        'breadcrumbs': null,
      },
      application_environment: {
        'phone' : window.navigator.platform,
        'appver' : ( this.config.appver || 'unknown' ),
        'appname' : ( this.config.appname || 'unknown' ),
        'osver' : ( typeof window.device !== 'undefined' )
                    ? window.device.version
                    : ua.substr(ua.indexOf('; ')+2,ua.length).replace(')',';').split(';')[0] || 'unknown',
        'user_agent' : bowser.name+" "+bowser.version,
        'cordova' : ( typeof window.device !== 'undefined' ) ? window.device.cordova : 'unknown',
        'device_name' : ( typeof window.device !== 'undefined' ) ? window.device.name : 'unknown',
        'log_data' : {}
      }
    }
  }
});
