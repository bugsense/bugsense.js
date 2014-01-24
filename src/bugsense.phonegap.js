extend(Bugsense.prototype, {
  generateDataFixture: function () {
    var ua = window.navigator.userAgent;
    return {
      client: {
        'name' : 'bugsense-js',
        'version' : '2.0.1'
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
        "wifi_on": false,
        "mobile_net_on": false,
        "gps_on": false
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
  },
  generateExceptionData: function( message, url, line, stack, custom_data, handled ) {
    if ( typeof( message ) != "string" ) {
      message = message.toString()
    }
    handled = handled ? 1 : 0;
    var crash = {};
    var msg = message.split(': ');
    var klass = TraceKit.computeStackTrace.guessFunctionName(url, line) || "unknown";
    var stacktrace = TraceKit.computeStackTrace.gatherContext(url, line);
    // var errorHash = this.computeErrorHash(this.getOffendingLine(stacktrace, line), msg[1], line, klass, this.dataFixture.appVersion)
    extend(crash, this.dataFixture, {
      'request': {
        'user_id': ( this.config.userIdentifier || 'unknown' ),
        'custom_data': custom_data,
        'handled': handled,
      },
      'exception': {
        'message'    : msg[1],
        'where'      : [ url, line ].join( ':' ),
        'klass'      : klass,
        'backtrace' : stacktrace,
        'breadcrumbs': this.breadcrumbs
      }
    });
    return crash;
  }
});
