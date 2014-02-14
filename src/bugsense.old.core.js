var bugsense;
(function ( root, factory ) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(function () {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return ( root.Bugsense = factory() );
        });
    } else {
        // Browser globals
        root.Bugsense = factory();
    }
}( this, function () {
  /**
   * Constructor for the Bugsense instance
   * @param {Object} config Overrides for the default config, use to specify api key
   */
  var Bugsense = function ( config ) {
    extend(this.config, config);
    this.config.uid  = this.generateUid();
    this.dataFixture = this.generateDataFixture();
    this.extraData   = {};
    this.breadcrumbs = [];
    this.queue = [];
    this.retrieveCache();

    if ( typeof(this.config.context.onerror) !== 'undefined' && !this.config.disableOnError )
      this.config.context.onerror = this.onerror;

    return this;
  };

  Bugsense.prototype = {
    // Default config
    config: {
      apiKey: 'FOOBAR',
      message: null,
      userIdentifier: null,
      appver: null,
      appname: null,
      osver: null,
      url: 'https://www.bugsense.com/api/errors',
      context: window
    },

    generateUid: function() {
      var uid;
      var uid = Lockr.get('bugsense_uid') || guid_generator();
      Lockr.set('bugsense_uid', uid);
      return uid;
    },


    /**
     * Kill bugsense and the app. Force exit
     */
    _die: function() {
      throw 'BugSense exited';
    },

    /**
     * Handles the response from the Bugsense API endpoint
     * @param  {Object} data       Bugsense response object
     * @param  {String} textStatus Response http status code
     * @param  {Object} XHR        XHR object
     */
    successHandler: function(request) {
      if (request.target && request.target.readyState != 4) { return; }
      if (request.target && request.target.status != 200) {
        return false;
      }
      // some console.log implementations don't support multiple parameters, guess it's okay in this case to concatenate
      if ('console' in window) {
        console.log('logged 1 error to Bugsense, status: ' + request.target.responseText);
      }
    },

    /**
     * Returns the Bugsense api url, with a cacheBuster argument
     * @return {String} Bugsense API URL endpoint
     */
    getPostURL: function( type ) {
      return Bugsense.prototype.config.url + '?cacheBuster=' + ( new Date() ).getTime();
    },
    /**
     * Parses a raw Error object
     * @param  {Object} error A raw Error object - e.g.: as sent from try/catch
     * @return {Object}       An object containing the parsed data as its properties
     */
    parseError: function( error ) {
      var parsedError = {}
      // Firefox
      if ( navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ){
        parsedError = {
          message: error.message,
          url: window.location.href,
          line: error.lineNumber,
          stack: error.stack,
          type: error.name
        }
        // Webkit
      } else {
        // If .stack is not available
        try {
          var where_parts = error.stack.split( '\n' ).slice(1)[0].match( /\s+at\s.*(\/.*\..*|<anonymous>:\d*:\d*)/ );
        } catch ( error ) {
          error.stack = error.message;
        }
        parsedError = {
          message: [ error.name, error.message ].join( ': ' ),
          url: where_parts ? where_parts[ 1 ].split( ':' )[ 0 ].replace("/","") : '',
          line: where_parts ? where_parts[ 1 ].split( ':' )[ 1 ] : '',
          stack: error.stack,
          type: error.name
        };
      }

      if ( parsedError.stack == null || ( typeof( parsedError.stack ) == 'string' && parsedError.stack.length == 0 ) ) {
        parsedError.stack = parsedError.message;
      }

      return parsedError;
    },
    getOffendingLine: function(stacktrace, line) {
      return (line < TraceKit.linesOfContext/2
              ? stacktrace[line-1]
              : stacktrace[5]);
    },
    computeErrorHash: function (offendingLine, message, line, klass, appVersion) {
      var string = offendingLine+message+line+klass+appVersion;
      return md5(string);
    },

    /**
     * Generates an object containing the exception data, compliant with Bugsense's API
     * @param  {String} exception   The error message ( also accepts Error Object, will be normalized )
     *                              e.g.: "Uncaught ReferenceError: ben is not defined"
     * @param  {String} url         The originating url
     *                              e.g.: "http://lmjabreu.local:8002/assets/js/main.js"
     * @param  {Number} line        The line number
     *                              e.g.: "12"
     * @param  {Object} custom_Data An object containing extra debugging data
     * @return {Object}           Bugsense API-compliant exception object
     */
    generateExceptionData: function( message, url, line, stack, custom_data ) {
      if ( typeof( message ) != "string" ) {
        message = message.toString()
      }
      var crash = {};
      var msg = message.split(': ');
      var klass = TraceKit.computeStackTrace.guessFunctionName(url, line)
      var stacktrace = TraceKit.computeStackTrace.gatherContext(url, line)
      // var errorHash = this.computeErrorHash(this.getOffendingLine(stacktrace, line), msg[1], line, klass, this.dataFixture.appVersion)
      extend(crash, this.dataFixture, {
        'exception': {
          'message'    : msg[1],
          'where'      : [ url, line ].join( ':' ),
          'klass'      : klass,
          'backtrace' : stacktrace,
          'breadcrumbs': this.breadcrumbs
        }
      });
      return crash;
    },

    /**
     * Returns true for Error objects
     * @param  {Object} exception The object to test
     * @return {Boolean}           True for Error objects - [object Error]
     */
    testException: function(exception) {
      return Object.prototype.toString.call(exception) === '[object Error]';
    },

    /**
     * Returns true if it is an exeption throwed by BugSense
     * @param {Object} exception
     */
    isBugsenseException: function(exception) {
      return this.testException(exception) && exception.detail.errorMessage === "BugSense exited";
    },

    /**
     * Notify Bugsense about an exception
     * @param  {String} exception   The error message ( also accepts Error Object, will be normalized )
     * @param  {String} url         The originating url
     * @param  {String} line        The line number
     * @param  {Object} custom_data Custom data to send over to Bugsense
     */
    notify: function(exception, url, line, column, custom_data) {
      // Handle cases where only Error object and custom data are sent - url will be the custom_data
      if (typeof(column) === 'object') custom_data = column;
      if (typeof(url) === 'object' && this.testException(exception)){custom_data = url; url = undefined;}

      var message, stack;
      // If the exception is the full Error object, extract what we want from it
      if ( this.testException( exception ) ) {
        var parsedError = this.parseError( exception );

        message = [ parsedError.type, parsedError.message ].join( ':' );
        url = parsedError.url;
        line = parsedError.line;
        stack = parsedError.stack;
        if (typeof (parsedError.handled) !== 'undefined') {
            if (typeof (custom_data) !== 'object') custom_data = {};
            custom_data.handled = 0;
        }
      } else {
          message = exception;
      }
      this.send(this.generateExceptionData(message, url, line, stack, custom_data), 'POST');
      return true;
    },
    send: function(data, method) {
      // Send the data over to Bugsense
      var request = new XMLHttpRequest();
      request.open(method, this.getPostURL(), true );
      request.setRequestHeader('X-BugSense-Api-Key', this.config.apiKey);
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      var that = this;
      request.onerror = function (a) {
        /* cache the report */
        that.cacheReport(data);
      }
      request.onreadystatechange = this.successHandler;
      request.send(param({ data: JSON.stringify(data) }));

    },
    onpromiseerror: function(event) {
      // Ignore bugsense raised exception
      if (window.bugsense.isBugsenseException(exception))
        return false;
      return window.bugsense.notify(event.detail.exception, event.detail.promise);
    }
  }
  return Bugsense;
}));
