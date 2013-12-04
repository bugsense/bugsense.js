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
    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = void 0;
        return this;
      }
      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    generateUid: function() {
      var uid;
      var uid = Lockr.get('bugsense_uid') || guid_generator();
      Lockr.set('bugsense_uid', uid);
      return uid;
    },

    /**
     * Add extra data (meta data) to be sent upon uncaught exception
     * @params {String} key      Key
     * @params {String} value    Value
     */
    addExtraData: function( key, value ) {
      if ( isValidKeyValue( key ) && isValidKeyValue( value ) ) {
        this.extraData[ key ] = value;
      }
    },

    /**
     * Remove a key value pair from extra data
     * @params {String} key      Key
     */
    removeExtraData: function( key ) {
      delete this.extraData[ key ];
    },

    /**
     * Clear extra data
     */
    clearExtraData: function() {
      this.extraData = {};
    },

    /**
     * Leave a breadcrump
     * @params {String} breadcrumb  Breadcrumb
     */
    leaveBreadcrumb: function( breadcrumb ) {
      if ( isValidKeyValue( breadcrumb ) ) {
        if ( this.breadcrumbs.length + 1 == 16 ) {
          this.breadcrumbs = this.breadcrumbs.slice( 1 );
        }
        this.breadcrumbs.push( breadcrumb );
      }
    },

    /**
     * Clear breadcrumbs
     */
    clearBreadcrumbs: function() {
      this.breadcrumbs = []
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
    cacheReport: function(data) {
      this.queue.push(data);
      this.updateCache();
    },
    retrieveCache: function () {
      var data = Lockr.get('bugsense_cache');
      this.queue = data || [];
      if (this.queue.length)
        this.sendCachedReport();
    },
    updateCache: function () {
      Lockr.hset('bugsense_cache', this.queue);
    },
    /**
     * Send cashed crash report
     */
    sendCachedReport: function() {
      // do stuff here
      if(this.queue.length) {
        var that = this;
        each(this.queue, function(data, index) {
          that.send(data, 'POST');
          that.queue.shift(index);
        });
        this.updateCache();
      } else {
        return false;
      }
    },
    /**
     * Closure function for unhandled exceptions
     *
     */
    onerror: function(exception, url, line, column, custom_data) {
      // Ignore bugsense raised exception
      if (window.bugsense.isBugsenseException(exception))
        return false;
      bugsense.trigger('crash');
      return window.bugsense.notify(exception, url, line, column, custom_data);
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
