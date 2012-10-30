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
   * Simple extend() implementation
   * @param  {Object} original The object to extend
   * @param  {Object} extra    The properties to extend with
   * @return {Object}          The extended original object
   */
  var extend = function extend ( original, extra ) {
    return Object.keys( extra ).forEach( function ( key ) { original[ key ] = extra[ key ]; } );
  };

  // BEGIN - Extracted from Zepto
  var escape = encodeURIComponent;

  var isObject = function isObject ( instance ) {
    return instance instanceof Object;
  };

  var isArray = function isArray ( instance ) {
    return instance instanceof Array;
  };

  /**
   * Simple forEach, implements jQuery/Zepto api, sort of, and most likely breaks with arrays: LOL
   * @param  {Object} obj      To be iterated
   * @param  {Object} iterator Iterator function
   */
  var forEach = function forEach ( obj, iterator ) {
    Array.prototype.forEach.call( Object.keys( obj ), function ( key ) {
      iterator( key, obj[ key ] );
    } );
  };

  var serialize = function serialize ( params, obj, traditional, scope ) {
    var array = isArray( obj );

    forEach( obj, function ( key, value ) {
      if ( scope ) { key = traditional ? scope : scope + '[' + (array ? '' : key) + ']'; }

      // handle data in serializeArray() format
      if ( !scope && array ) {
        params.add( value.name, value.value );
      // recurse into nested objects
      } else if ( traditional ? isArray( value ) : isObject( value ) ) {
        serialize( params, value, traditional, key );
      } else {
        params.add( key, value );
      }
    });
  };

  var param = function param ( obj, traditional ) {
    var params = [];
    params.add = function( k, v ){ this.push( escape( k ) + '=' + escape( v ) ); };
    serialize( params, obj, traditional );
    return params.join( '&' ).replace( /%20/g, '+' );
  };
  // END - Extracted from Zepto

  /**
   * Constructor for the Bugsense instance
   * @param {Object} config Overrides for the default config, use to specify api key
   */
  var Bugsense = function ( config ) {
    extend( this.config, config );

    return this;
  };

  // Default config
  Bugsense.prototype.config = {
    apiKey : 'FOOBAR',
    url    : 'https://bugsense.appspot.com/api/errors'
  };

  /**
   * Handles the response from the Bugsense API endpoint
   * @param  {Object} data       Bugsense response object
   * @param  {String} textStatus Response http status code
   * @param  {Object} XHR        XHR object
   */
  Bugsense.prototype.successHandler = function bugsenseSuccessHandler ( request ) {
    if ( request.target && request.target.readyState != 4 )  { return; }
    // some console.log implementations don't support multiple parameters, guess it's okay in this case to concatenate
    if ( 'console' in window ) { console.log( 'logged 1 error to Bugsense, status: ' + request.target.responseText ); }
  };

  /**
   * Returns the Bugsense api url, with a cacheBuster argument
   * @return {String} Bugsense API URL endpoint
   */
  Bugsense.prototype.getPostURL = function bugsenseGetPostURL () {
    return Bugsense.prototype.config.url + '?cacheBuster=' + ( new Date() ).getTime();
  };

  /**
   * Parses a raw Error object
   * @param  {Object} error A raw Error object - e.g.: as sent from try/catch
   * @return {Object}       An object containing the parsed data as its properties
   */
  Bugsense.prototype.parseError = function bugsenseParseError ( error ) {
    var where_parts = error.stack.split( '\n' ).slice(1)[0].match( /\s+at\s.*(\/.*\..*|<anonymous>:\d*:\d*)/ );

    var parsedError = {
      message: [ error.name, error.message ].join( ': ' ),
      url: where_parts[ 1 ].split( ':' )[ 0 ],
      line: where_parts[ 1 ].split( ':' )[ 1 ],
      stack: error.stack,
      type: error.name
    };

    return parsedError;
  };

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
  Bugsense.prototype.generateExceptionData = function bugsenseGenerateExceptionData ( message, url, line, stack, custom_data ) {
    return {
      // information about the bugsense client
      client: {
        // Obligatory
        'name'    : 'bugsense-js',
        // Optional
        'version' : '0.1'
      },
      // Optional
      // details & custom data about the exception including url, request, response,…
      request: {
        // 'remote_ip'   : '',
        'custom_data' : custom_data
      },
      // basics about the exception
      exception: {
        // Obligatory
        'message'   : message,
        'where'     : [ url, line ].join( ':' ),
        'klass'     : message.split( ':' )[ 0 ],
        // Optional
        'backtrace' : ''
      },
      // basic data ( required )
      application_environment: {
        // Obligatory
        'phone'              : window.navigator.platform,
        'appver'             : ( this.config.appversion || 'unknown' ),
        'appname'            : ( this.config.appname || 'unknown' ),
        'osver'              : ( typeof window.device !== 'undefined' ) ? window.device.version : ( window.navigator.userAgent.match( /\(.*;\s(.*)\)\s.*\(.*\)/)[1] || 'unknown' ),
        // Optional
        'connection_type'    : ( typeof window.navigator.network !== 'undefined' ) ? window.navigator.network.connection.type : 'unknown',
        'user_agent'         : window.navigator.userAgent,
        'cordova'            : ( typeof window.device !== 'undefined' ) ? window.device.cordova : 'unknown',
        'device_name'        : ( typeof window.device !== 'undefined' ) ? window.device.name : 'unknown'
      }
    };
  };

  /**
   * Returns true for Error objects
   * @param  {Object} exception The object to test
   * @return {Boolean}           True for Error objects - [object Error]
   */
  Bugsense.prototype.testException = function bugsenseTestException ( exception ) {

    return Object.prototype.toString.call( exception ) === '[object Error]';
  };

  /**
   * Notify Bugsense about an exception
   * @param  {String} exception   The error message ( also accepts Error Object, will be normalized )
   * @param  {String} url         The originating url
   * @param  {String} line        The line number
   * @param  {Object} custom_data Custom data to send over to Bugsense
   */
  Bugsense.prototype.notify = function bugsenseNotify ( exception, url, line, custom_data ) {
    var stack;
    // Handle cases where only Error object and custom data are sent - url will be the custom_data
    if ( arguments.length === 2 && this.testException( exception ) ) { custom_data = url; url = undefined; }

    // If the exception is the full Error object, extract what we want from it
    if ( this.testException( exception ) ) {
      var parsedError = this.parseError( exception );

      message = [ parsedError.type ,parsedError.message ].join( ':' );
      url = parsedError.url;
      line = parsedError.line;
      stack = exception.stack;
    }

    // Proceed formatting the data
    var data = this.generateExceptionData( exception, url, line, stack, custom_data );

    // Send the data over to Bugsense
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open( 'POST', this.getPostURL(), true );
    xmlhttp.setRequestHeader( 'X-BugSense-Api-Key', this.config.apiKey );
    xmlhttp.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    xmlhttp.onreadystatechange = this.successHandler;
    xmlhttp.send( param( { data: JSON.stringify( data ) } ) );

  };

  return Bugsense;

}));