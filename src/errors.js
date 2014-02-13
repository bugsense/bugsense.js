Bugsense.Errors = (function () {
  var ua = window.navigator.userAgent;
  var dataFixture = {
    client: {
      'name' : 'bugsense-js',
      'version' : '2.0'
    },
    request: {
      'user_id': ( Bugsense.config.userIdentifier || 'unknown' ),
      'custom_data' : []
    },
    exception: {
      'message' : null,
      'where' : null,
      'klass' : null,
      'backtrace' : null,
      'breadcrumbs': null
    },
    application_environment: {
      'phone' : window.navigator.platform,
      'appver' : ( Bugsense.config.appver || 'unknown' ),
      'appname' : ( Bugsense.config.appname || 'unknown' ),
      'osver' : ( typeof window.device !== 'undefined' )
        ? window.device.version
        : ua.substr(ua.indexOf('; ')+2,ua.length).replace(')',';').split(';')[0] || 'unknown',
        'user_agent' : bowser.name+" "+bowser.version,
        'cordova' : ( typeof window.device !== 'undefined' ) ? window.device.cordova : 'unknown',
        'device_name' : ( typeof window.device !== 'undefined' ) ? window.device.name : 'unknown',
        'log_data' : {}
    }
  };

  var getOffendingLine = function(stacktrace, line) {
    return (line < TraceKit.linesOfContext/2
      ? stacktrace[line-1]
      : stacktrace[5]);
  };
  var computeErrorHash = function (offendingLine, message, line, klass, appVersion) {
    var string = offendingLine+message+line+klass+appVersion;
    return md5(string);
  };
  var testException = function(exception) {
    return Object.prototype.toString.call(exception) === '[object Error]';
  };

  var parse = function(data) {
    if (navigator.userAgent.match(/Firefox/)) {

    }
    var parsedError = { // Chrome
      message: data.exception,
      url: data.url || data.lineNumber || data.sourceURL,
      line: data.line,
    };
    parsedError.custom_data = data.custom_data || undefined;

    if (bowser.chrome) {
      parsedError.stack = data.errorobj.stack
    }

    return parsedError;
  };

  var generateExceptionData = function(error) {
    var message = ( typeof( error ) != "string" ) ? error.toString() : error.message,
    crash = {},
    stacktrace = getStackTrace(error),
    msg = message.split(': '),
    url = error.url || error.lineNumber || error.sourceUrl,
    line = error.line;
    klass = url && line ? TraceKit.computeStackTrace.guessFunctionName(url, line) : "unknown",
    // errorHash = this.computeErrorHash(this.getOffendingLine(stacktrace, line), msg[1], line, klass, this.dataFixture.appVersion)
    extend(crash, dataFixture, {
      'exception': {
        'message': msg[1],
        'where': [ url, line ].join( ':' ),
        'klass': klass,
        'backtrace': stacktrace,
        'breadcrumbs': Bugsense.breadcrumbs
      }
    });
    if(error.custom_data) crash.request.custom_data.push(error.custom_data);
    return crash;
  };

  var getStackTrace = function(error) {
    return error.stack || TraceKit.computeStackTrace(error);
  };


  Bugsense.notify = function(data, custom_data) {
    var parsedError = {};
    if(custom_data) data.custom_data = custom_data;
    if(!testException(data)) {
      parsedError.message = data;
    } else {
      parsedError = parse(data);
    }

    Bugsense.Network.send(generateExceptionData(parsedError), 'POST');
    return true;
  };

  window.onerror = function(exception, url, line, column, errorobj) {
    // Ignore bugsense raised exception
    // if (window.bugsense.isBugsenseException(exception))
    //   return false;
    Bugsense.trigger('crash');

    return Bugsense.notify({
      exception: exception,
      url: url,
      line: line,
      column: column,
      errorobj: errorobj
    });
  };

  return {
    parse: parse
  }
}());
