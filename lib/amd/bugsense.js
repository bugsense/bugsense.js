(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('bugsense', [], factory);
    } else {
        // Browser globals
        root.Bugsense = factory(root.b);
    }
}(this, function () {

    /*!
      * Bowser - a browser detector
      * https://github.com/ded/bowser
      * MIT License | (c) Dustin Diaz 2014
      */
    
    (function () {
      /**
       * See useragents.js for examples of navigator.userAgent
       */
    
      var t = true
    
      function detect(ua) {
    
        function getFirstMatch(regex) {
          var match = ua.match(regex);
          return (match && match.length > 1 && match[1]) || '';
        }
    
        var iosdevice = getFirstMatch(/(ipod|iphone|ipad)/i).toLowerCase()
          , likeAndroid = /like android/i.test(ua)
          , android = !likeAndroid && /android/i.test(ua)
          , versionIdentifier = getFirstMatch(/version\/(\d+(\.\d+)?)/i)
          , tablet = /tablet/i.test(ua)
          , mobile = !tablet && /[^-]mobi/i.test(ua)
          , result
    
        if (/opera|opr/i.test(ua)) {
          result = {
            name: 'Opera'
            , opera: t
            , version: versionIdentifier || getFirstMatch(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)
          }
        }
        else if (/windows phone/i.test(ua)) {
          result = {
            name: 'Windows Phone'
            , windowsphone: t
            , msie: t
            , version: getFirstMatch(/iemobile\/(\d+(\.\d+)?)/i)
          }
        }
        else if (/msie|trident/i.test(ua)) {
          result = {
            name: 'Internet Explorer'
            , msie: t
            , version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
          }
        }
        else if (/chrome|crios|crmo/i.test(ua)) {
          result = {
            name: 'Chrome'
            , chrome: t
            , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
          }
        }
        else if (iosdevice) {
          result = {
            name : iosdevice == 'iphone' ? 'iPhone' : iosdevice == 'ipad' ? 'iPad' : 'iPod'
          }
          // WTF: version is not part of user agent in web apps
          if (versionIdentifier) {
            result.version = versionIdentifier
          }
        }
        else if (/sailfish/i.test(ua)) {
          result = {
            name: 'Sailfish'
            , sailfish: t
            , version: getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
          }
        }
        else if (/seamonkey\//i.test(ua)) {
          result = {
            name: 'SeaMonkey'
            , seamonkey: t
            , version: getFirstMatch(/seamonkey\/(\d+(\.\d+)?)/i)
          }
        }
        else if (/firefox|iceweasel/i.test(ua)) {
          result = {
            name: 'Firefox'
            , firefox: t
            , version: getFirstMatch(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)
          }
          if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
            result.firefoxos = t
          }
        }
        else if (/silk/i.test(ua)) {
          result =  {
            name: 'Amazon Silk'
            , silk: t
            , version : getFirstMatch(/silk\/(\d+(\.\d+)?)/i)
          }
        }
        else if (android) {
          result = {
            name: 'Android'
            , version: versionIdentifier
          }
        }
        else if (/phantom/i.test(ua)) {
          result = {
            name: 'PhantomJS'
            , phantom: t
            , version: getFirstMatch(/phantomjs\/(\d+(\.\d+)?)/i)
          }
        }
        else if (/blackberry|\bbb\d+/i.test(ua) || /rim\stablet/i.test(ua)) {
          result = {
            name: 'BlackBerry'
            , blackberry: t
            , version: versionIdentifier || getFirstMatch(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
          }
        }
        else if (/(web|hpw)os/i.test(ua)) {
          result = {
            name: 'WebOS'
            , webos: t
            , version: versionIdentifier || getFirstMatch(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
          };
          /touchpad\//i.test(ua) && (result.touchpad = t)
        }
        else if (/bada/i.test(ua)) {
          result = {
            name: 'Bada'
            , bada: t
            , version: getFirstMatch(/dolfin\/(\d+(\.\d+)?)/i)
          };
        }
        else if (/tizen/i.test(ua)) {
          result = {
            name: 'Tizen'
            , tizen: t
            , version: getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || versionIdentifier
          };
        }
        else if (/safari/i.test(ua)) {
          result = {
            name: 'Safari'
            , safari: t
            , version: versionIdentifier
          }
        }
        else result = {}
    
        // set webkit or gecko flag for browsers based on these engines
        if (/(apple)?webkit/i.test(ua)) {
          result.name = result.name || "Webkit"
          result.webkit = t
          if (!result.version && versionIdentifier) {
            result.version = versionIdentifier
          }
        } else if (!result.opera && /gecko\//i.test(ua)) {
          result.name = result.name || "Gecko"
          result.gecko = t
          result.version = result.version || getFirstMatch(/gecko\/(\d+(\.\d+)?)/i)
        }
    
        // set OS flags for platforms that have multiple browsers
        if (android || result.silk) {
          result.android = t
        } else if (iosdevice) {
          result[iosdevice] = t
          result.ios = t
        }
    
        // OS version extraction
        var osVersion = '';
        if (iosdevice) {
          osVersion = getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i);
          osVersion = osVersion.replace(/[_\s]/g, '.');
        } else if (android) {
          osVersion = getFirstMatch(/android[ \/-](\d+(\.\d+)*)/i);
        } else if (result.windowsphone) {
          osVersion = getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
        } else if (result.webos) {
          osVersion = getFirstMatch(/(?:web|hpw)os\/(\d+(\.\d+)*)/i);
        } else if (result.blackberry) {
          osVersion = getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i);
        } else if (result.bada) {
          osVersion = getFirstMatch(/bada\/(\d+(\.\d+)*)/i);
        } else if (result.tizen) {
          osVersion = getFirstMatch(/tizen[\/\s](\d+(\.\d+)*)/i);
        }
        if (osVersion) {
          result.osversion = osVersion;
        }
    
        // device type extraction
        var osMajorVersion = osVersion.split('.')[0];
        if (tablet || iosdevice == 'ipad' || (android && (osMajorVersion == 3 || (osMajorVersion == 4 && !mobile))) || result.silk) {
          result.tablet = t
        } else if (mobile || iosdevice == 'iphone' || iosdevice == 'ipod' || android || result.blackberry || result.webos || result.bada) {
          result.mobile = t
        }
    
        // Graded Browser Support
        // http://developer.yahoo.com/yui/articles/gbs
        if ((result.msie && result.version >= 10) ||
          (result.chrome && result.version >= 20) ||
          (result.firefox && result.version >= 20.0) ||
          (result.safari && result.version >= 6) ||
          (result.opera && result.version >= 10.0) ||
          (result.ios && result.osversion && result.osversion.split(".")[0] >= 6)
          ) {
          result.a = t;
        }
        else if ((result.msie && result.version < 10) ||
          (result.chrome && result.version < 20) ||
          (result.firefox && result.version < 20.0) ||
          (result.safari && result.version < 6) ||
          (result.opera && result.version < 10.0) ||
          (result.ios && result.osversion && result.osversion.split(".")[0] < 6)
          ) {
          result.c = t
        } else result.x = t
    
        return result
      }
    
      var bowser = detect(typeof navigator !== 'undefined' ? navigator.userAgent : '')
    
    
      /*
       * Set our detect method to the main bowser object so we can
       * reuse it to test other user agents.
       * This is needed to implement future tests.
       */
      bowser._detect = detect;
    
      this.bowser = bowser;
    }).call(this);
    
    /*
     TraceKit - Cross brower stack traces - github.com/occ/TraceKit
     MIT license
    */
    
    (function(window, undefined) {
    
    
    var TraceKit = {};
    var _oldTraceKit = window.TraceKit;
    
    // global reference to slice
    var _slice = [].slice;
    var UNKNOWN_FUNCTION = 'unknown';
    
    
    /**
     * _has, a better form of hasOwnProperty
     * Example: _has(MainHostObject, property) === true/false
     *
     * @param {Object} host object to check property
     * @param {string} key to check
     */
    function _has(object, key) {
        return Object.prototype.hasOwnProperty.call(object, key);
    }
    
    function _isUndefined(what) {
        return typeof what === 'undefined';
    }
    
    /**
     * TraceKit.noConflict: Export TraceKit out to another variable
     * Example: var TK = TraceKit.noConflict()
     */
    TraceKit.noConflict = function noConflict() {
        window.TraceKit = _oldTraceKit;
        return TraceKit;
    };
    
    /**
     * TraceKit.wrap: Wrap any function in a TraceKit reporter
     * Example: func = TraceKit.wrap(func);
     *
     * @param {Function} func Function to be wrapped
     * @return {Function} The wrapped func
     */
    TraceKit.wrap = function traceKitWrapper(func) {
        function wrapped() {
            try {
                return func.apply(this, arguments);
            } catch (e) {
                TraceKit.report(e);
                throw e;
            }
        }
        return wrapped;
    };
    
    /**
     * TraceKit.report: cross-browser processing of unhandled exceptions
     *
     * Syntax:
     *   TraceKit.report.subscribe(function(stackInfo) { ... })
     *   TraceKit.report.unsubscribe(function(stackInfo) { ... })
     *   TraceKit.report(exception)
     *   try { ...code... } catch(ex) { TraceKit.report(ex); }
     *
     * Supports:
     *   - Firefox: full stack trace with line numbers, plus column number
     *              on top frame; column number is not guaranteed
     *   - Opera:   full stack trace with line and column numbers
     *   - Chrome:  full stack trace with line and column numbers
     *   - Safari:  line and column number for the top frame only; some frames
     *              may be missing, and column number is not guaranteed
     *   - IE:      line and column number for the top frame only; some frames
     *              may be missing, and column number is not guaranteed
     *
     * In theory, TraceKit should work on all of the following versions:
     *   - IE5.5+ (only 8.0 tested)
     *   - Firefox 0.9+ (only 3.5+ tested)
     *   - Opera 7+ (only 10.50 tested; versions 9 and earlier may require
     *     Exceptions Have Stacktrace to be enabled in opera:config)
     *   - Safari 3+ (only 4+ tested)
     *   - Chrome 1+ (only 5+ tested)
     *   - Konqueror 3.5+ (untested)
     *
     * Requires TraceKit.computeStackTrace.
     *
     * Tries to catch all unhandled exceptions and report them to the
     * subscribed handlers. Please note that TraceKit.report will rethrow the
     * exception. This is REQUIRED in order to get a useful stack trace in IE.
     * If the exception does not reach the top of the browser, you will only
     * get a stack trace from the point where TraceKit.report was called.
     *
     * Handlers receive a stackInfo object as described in the
     * TraceKit.computeStackTrace docs.
     */
    TraceKit.report = (function reportModuleWrapper() {
        var handlers = [],
            lastException = null,
            lastExceptionStack = null;
    
        /**
         * Add a crash handler.
         * @param {Function} handler
         */
        function subscribe(handler) {
            installGlobalHandler();
            handlers.push(handler);
        }
    
        /**
         * Remove a crash handler.
         * @param {Function} handler
         */
        function unsubscribe(handler) {
            for (var i = handlers.length - 1; i >= 0; --i) {
                if (handlers[i] === handler) {
                    handlers.splice(i, 1);
                }
            }
        }
    
        /**
         * Dispatch stack information to all handlers.
         * @param {Object.<string, *>} stack
         */
        function notifyHandlers(stack, windowError) {
            var exception = null;
            if (windowError && !TraceKit.collectWindowErrors) {
              return;
            }
            for (var i in handlers) {
                if (_has(handlers, i)) {
                    try {
                        handlers[i].apply(null, [stack].concat(_slice.call(arguments, 2)));
                    } catch (inner) {
                        exception = inner;
                    }
                }
            }
    
            if (exception) {
                throw exception;
            }
        }
    
        var _oldOnerrorHandler, _onErrorHandlerInstalled;
    
        /**
         * Ensures all global unhandled exceptions are recorded.
         * Supported by Gecko and IE.
         * @param {string} message Error message.
         * @param {string} url URL of script that generated the exception.
         * @param {(number|string)} lineNo The line number at which the error
         * occurred.
         */
        function traceKitWindowOnError(message, url, lineNo) {
            var stack = null;
    
            if (lastExceptionStack) {
                TraceKit.computeStackTrace.augmentStackTraceWithInitialElement(lastExceptionStack, url, lineNo, message);
                stack = lastExceptionStack;
                lastExceptionStack = null;
                lastException = null;
            } else {
                var location = {
                    'url': url,
                    'line': lineNo
                };
                location.func = TraceKit.computeStackTrace.guessFunctionName(location.url, location.line);
                location.context = TraceKit.computeStackTrace.gatherContext(location.url, location.line);
                stack = {
                    'mode': 'onerror',
                    'message': message,
                    'url': document.location.href,
                    'stack': [location]
                };
            }
    
            notifyHandlers(stack, 'from window.onerror');
    
            if (_oldOnerrorHandler) {
                return _oldOnerrorHandler.apply(this, arguments);
            }
    
            return false;
        }
    
        function installGlobalHandler ()
        {
            if (_onErrorHandlerInstalled === true) {
                return;
            }
            _oldOnerrorHandler = window.onerror;
            window.onerror = traceKitWindowOnError;
            _onErrorHandlerInstalled = true;
        }
    
        /**
         * Reports an unhandled Error to TraceKit.
         * @param {Error} ex
         */
        function report(ex) {
            var args = _slice.call(arguments, 1);
            if (lastExceptionStack) {
                if (lastException === ex) {
                    return; // already caught by an inner catch block, ignore
                } else {
                    var s = lastExceptionStack;
                    lastExceptionStack = null;
                    lastException = null;
                    notifyHandlers.apply(null, [s, null].concat(args));
                }
            }
    
            var stack = TraceKit.computeStackTrace(ex);
            lastExceptionStack = stack;
            lastException = ex;
    
            // If the stack trace is incomplete, wait for 2 seconds for
            // slow slow IE to see if onerror occurs or not before reporting
            // this exception; otherwise, we will end up with an incomplete
            // stack trace
            window.setTimeout(function () {
                if (lastException === ex) {
                    lastExceptionStack = null;
                    lastException = null;
                    notifyHandlers.apply(null, [stack, null].concat(args));
                }
            }, (stack.incomplete ? 2000 : 0));
    
            throw ex; // re-throw to propagate to the top level (and cause window.onerror)
        }
    
        report.subscribe = subscribe;
        report.unsubscribe = unsubscribe;
        return report;
    }());
    
    /**
     * TraceKit.computeStackTrace: cross-browser stack traces in JavaScript
     *
     * Syntax:
     *   s = TraceKit.computeStackTrace.ofCaller([depth])
     *   s = TraceKit.computeStackTrace(exception) // consider using TraceKit.report instead (see below)
     * Returns:
     *   s.name              - exception name
     *   s.message           - exception message
     *   s.stack[i].url      - JavaScript or HTML file URL
     *   s.stack[i].func     - function name, or empty for anonymous functions (if guessing did not work)
     *   s.stack[i].args     - arguments passed to the function, if known
     *   s.stack[i].line     - line number, if known
     *   s.stack[i].column   - column number, if known
     *   s.stack[i].context  - an array of source code lines; the middle element corresponds to the correct line#
     *   s.mode              - 'stack', 'stacktrace', 'multiline', 'callers', 'onerror', or 'failed' -- method used to collect the stack trace
     *
     * Supports:
     *   - Firefox:  full stack trace with line numbers and unreliable column
     *               number on top frame
     *   - Opera 10: full stack trace with line and column numbers
     *   - Opera 9-: full stack trace with line numbers
     *   - Chrome:   full stack trace with line and column numbers
     *   - Safari:   line and column number for the topmost stacktrace element
     *               only
     *   - IE:       no line numbers whatsoever
     *
     * Tries to guess names of anonymous functions by looking for assignments
     * in the source code. In IE and Safari, we have to guess source file names
     * by searching for function bodies inside all page scripts. This will not
     * work for scripts that are loaded cross-domain.
     * Here be dragons: some function names may be guessed incorrectly, and
     * duplicate functions may be mismatched.
     *
     * TraceKit.computeStackTrace should only be used for tracing purposes.
     * Logging of unhandled exceptions should be done with TraceKit.report,
     * which builds on top of TraceKit.computeStackTrace and provides better
     * IE support by utilizing the window.onerror event to retrieve information
     * about the top of the stack.
     *
     * Note: In IE and Safari, no stack trace is recorded on the Error object,
     * so computeStackTrace instead walks its *own* chain of callers.
     * This means that:
     *  * in Safari, some methods may be missing from the stack trace;
     *  * in IE, the topmost function in the stack trace will always be the
     *    caller of computeStackTrace.
     *
     * This is okay for tracing (because you are likely to be calling
     * computeStackTrace from the function you want to be the topmost element
     * of the stack trace anyway), but not okay for logging unhandled
     * exceptions (because your catch block will likely be far away from the
     * inner function that actually caused the exception).
     *
     * Tracing example:
     *     function trace(message) {
     *         var stackInfo = TraceKit.computeStackTrace.ofCaller();
     *         var data = message + "\n";
     *         for(var i in stackInfo.stack) {
     *             var item = stackInfo.stack[i];
     *             data += (item.func || '[anonymous]') + "() in " + item.url + ":" + (item.line || '0') + "\n";
     *         }
     *         if (window.console)
     *             console.info(data);
     *         else
     *             alert(data);
     *     }
     */
    TraceKit.computeStackTrace = (function computeStackTraceWrapper() {
        var debug = false,
            sourceCache = {};
    
        /**
         * Attempts to retrieve source code via XMLHttpRequest, which is used
         * to look up anonymous function names.
         * @param {string} url URL of source code.
         * @return {string} Source contents.
         */
        function loadSource(url) {
            if (!TraceKit.remoteFetching) { //Only attempt request if remoteFetching is on.
                return '';
            }
            try {
                var getXHR = function() {
                    try {
                        return new window.XMLHttpRequest();
                    } catch (e) {
                        // explicitly bubble up the exception if not found
                        return new window.ActiveXObject('Microsoft.XMLHTTP');
                    }
                };
    
                var request = getXHR();
                request.open('GET', url, false);
                request.send('');
                return request.responseText;
            } catch (e) {
                return '';
            }
        }
    
        /**
         * Retrieves source code from the source code cache.
         * @param {string} url URL of source code.
         * @return {Array.<string>} Source contents.
         */
        function getSource(url) {
            if (!_has(sourceCache, url)) {
                // URL needs to be able to fetched within the acceptable domain.  Otherwise,
                // cross-domain errors will be triggered.
                var source = '';
                if (url.indexOf(document.domain) !== -1) {
                    source = loadSource(url);
                }
                sourceCache[url] = source ? source.split('\n') : [];
            }
    
            return sourceCache[url];
        }
    
        /**
         * Tries to use an externally loaded copy of source code to determine
         * the name of a function by looking at the name of the variable it was
         * assigned to, if any.
         * @param {string} url URL of source code.
         * @param {(string|number)} lineNo Line number in source code.
         * @return {string} The function name, if discoverable.
         */
        function guessFunctionName(url, lineNo) {
            var reFunctionArgNames = /function ([^(]*)\(([^)]*)\)/,
                reGuessFunction = /['"]?([0-9A-Za-z$_]+)['"]?\s*[:=]\s*(function|eval|new Function)/,
                line = '',
                maxLines = 10,
                source = getSource(url),
                m;
    
            if (!source.length) {
                return UNKNOWN_FUNCTION;
            }
    
            // Walk backwards from the first line in the function until we find the line which
            // matches the pattern above, which is the function definition
            for (var i = 0; i < maxLines; ++i) {
                line = source[lineNo - i] + line;
    
                if (!_isUndefined(line)) {
                    if ((m = reGuessFunction.exec(line))) {
                        return m[1];
                    } else if ((m = reFunctionArgNames.exec(line))) {
                        return m[1];
                    }
                }
            }
    
            return UNKNOWN_FUNCTION;
        }
    
        /**
         * Retrieves the surrounding lines from where an exception occurred.
         * @param {string} url URL of source code.
         * @param {(string|number)} line Line number in source code to centre
         * around for context.
         * @return {?Array.<string>} Lines of source code.
         */
        function gatherContext(url, line) {
            var source = getSource(url);
    
            if (!source.length) {
                return null;
            }
    
            var context = [],
                // linesBefore & linesAfter are inclusive with the offending line.
                // if linesOfContext is even, there will be one extra line
                //   *before* the offending line.
                linesBefore = Math.floor(TraceKit.linesOfContext / 2),
                // Add one extra line if linesOfContext is odd
                linesAfter = linesBefore + (TraceKit.linesOfContext % 2),
                start = Math.max(0, line - linesBefore - 1),
                end = Math.min(source.length, line + linesAfter - 1);
    
            line -= 1; // convert to 0-based index
    
            for (var i = start; i < end; ++i) {
                if (!_isUndefined(source[i])) {
                    context.push(source[i]);
                }
            }
    
            return context.length > 0 ? context : null;
        }
    
        /**
         * Escapes special characters, except for whitespace, in a string to be
         * used inside a regular expression as a string literal.
         * @param {string} text The string.
         * @return {string} The escaped string literal.
         */
        function escapeRegExp(text) {
            return text.replace(/[\-\[\]{}()*+?.,\\\^$|#]/g, '\\$&');
        }
    
        /**
         * Escapes special characters in a string to be used inside a regular
         * expression as a string literal. Also ensures that HTML entities will
         * be matched the same as their literal friends.
         * @param {string} body The string.
         * @return {string} The escaped string.
         */
        function escapeCodeAsRegExpForMatchingInsideHTML(body) {
            return escapeRegExp(body).replace('<', '(?:<|&lt;)').replace('>', '(?:>|&gt;)').replace('&', '(?:&|&amp;)').replace('"', '(?:"|&quot;)').replace(/\s+/g, '\\s+');
        }
    
        /**
         * Determines where a code fragment occurs in the source code.
         * @param {RegExp} re The function definition.
         * @param {Array.<string>} urls A list of URLs to search.
         * @return {?Object.<string, (string|number)>} An object containing
         * the url, line, and column number of the defined function.
         */
        function findSourceInUrls(re, urls) {
            var source, m;
            for (var i = 0, j = urls.length; i < j; ++i) {
                // console.log('searching', urls[i]);
                if ((source = getSource(urls[i])).length) {
                    source = source.join('\n');
                    if ((m = re.exec(source))) {
                        // console.log('Found function in ' + urls[i]);
    
                        return {
                            'url': urls[i],
                            'line': source.substring(0, m.index).split('\n').length,
                            'column': m.index - source.lastIndexOf('\n', m.index) - 1
                        };
                    }
                }
            }
    
            // console.log('no match');
    
            return null;
        }
    
        /**
         * Determines at which column a code fragment occurs on a line of the
         * source code.
         * @param {string} fragment The code fragment.
         * @param {string} url The URL to search.
         * @param {(string|number)} line The line number to examine.
         * @return {?number} The column number.
         */
        function findSourceInLine(fragment, url, line) {
            var source = getSource(url),
                re = new RegExp('\\b' + escapeRegExp(fragment) + '\\b'),
                m;
    
            line -= 1;
    
            if (source && source.length > line && (m = re.exec(source[line]))) {
                return m.index;
            }
    
            return null;
        }
    
        /**
         * Determines where a function was defined within the source code.
         * @param {(Function|string)} func A function reference or serialized
         * function definition.
         * @return {?Object.<string, (string|number)>} An object containing
         * the url, line, and column number of the defined function.
         */
        function findSourceByFunctionBody(func) {
            var urls = [window.location.href],
                scripts = document.getElementsByTagName('script'),
                body,
                code = '' + func,
                codeRE = /^function(?:\s+([\w$]+))?\s*\(([\w\s,]*)\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/,
                eventRE = /^function on([\w$]+)\s*\(event\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/,
                re,
                parts,
                result;
    
            for (var i = 0; i < scripts.length; ++i) {
                var script = scripts[i];
                if (script.src) {
                    urls.push(script.src);
                }
            }
    
            if (!(parts = codeRE.exec(code))) {
                re = new RegExp(escapeRegExp(code).replace(/\s+/g, '\\s+'));
            }
    
            // not sure if this is really necessary, but I don’t have a test
            // corpus large enough to confirm that and it was in the original.
            else {
                var name = parts[1] ? '\\s+' + parts[1] : '',
                    args = parts[2].split(',').join('\\s*,\\s*');
    
                body = escapeRegExp(parts[3]).replace(/;$/, ';?'); // semicolon is inserted if the function ends with a comment.replace(/\s+/g, '\\s+');
                re = new RegExp('function' + name + '\\s*\\(\\s*' + args + '\\s*\\)\\s*{\\s*' + body + '\\s*}');
            }
    
            // look for a normal function definition
            if ((result = findSourceInUrls(re, urls))) {
                return result;
            }
    
            // look for an old-school event handler function
            if ((parts = eventRE.exec(code))) {
                var event = parts[1];
                body = escapeCodeAsRegExpForMatchingInsideHTML(parts[2]);
    
                // look for a function defined in HTML as an onXXX handler
                re = new RegExp('on' + event + '=[\\\'"]\\s*' + body + '\\s*[\\\'"]', 'i');
    
                if ((result = findSourceInUrls(re, urls[0]))) {
                    return result;
                }
    
                // look for ???
                re = new RegExp(body);
    
                if ((result = findSourceInUrls(re, urls))) {
                    return result;
                }
            }
    
            return null;
        }
    
        // Contents of Exception in various browsers.
        //
        // SAFARI:
        // ex.message = Can't find variable: qq
        // ex.line = 59
        // ex.sourceId = 580238192
        // ex.sourceURL = http://...
        // ex.expressionBeginOffset = 96
        // ex.expressionCaretOffset = 98
        // ex.expressionEndOffset = 98
        // ex.name = ReferenceError
        //
        // FIREFOX:
        // ex.message = qq is not defined
        // ex.fileName = http://...
        // ex.lineNumber = 59
        // ex.stack = ...stack trace... (see the example below)
        // ex.name = ReferenceError
        //
        // CHROME:
        // ex.message = qq is not defined
        // ex.name = ReferenceError
        // ex.type = not_defined
        // ex.arguments = ['aa']
        // ex.stack = ...stack trace...
        //
        // INTERNET EXPLORER:
        // ex.message = ...
        // ex.name = ReferenceError
        //
        // OPERA:
        // ex.message = ...message... (see the example below)
        // ex.name = ReferenceError
        // ex.opera#sourceloc = 11  (pretty much useless, duplicates the info in ex.message)
        // ex.stacktrace = n/a; see 'opera:config#UserPrefs|Exceptions Have Stacktrace'
    
        /**
         * Computes stack trace information from the stack property.
         * Chrome and Gecko use this property.
         * @param {Error} ex
         * @return {?Object.<string, *>} Stack trace information.
         */
        function computeStackTraceFromStackProp(ex) {
            if (!ex.stack) {
                return null;
            }
    
            var chrome = /^\s*at (?:((?:\[object object\])?\S+(?: \[as \S+\])?) )?\(?((?:file|http|https):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
                gecko = /^\s*(\S*)(?:\((.*?)\))?@((?:file|http|https).*?):(\d+)(?::(\d+))?\s*$/i,
                lines = ex.stack.split('\n'),
                stack = [],
                parts,
                element,
                reference = /^(.*) is undefined$/.exec(ex.message);
    
            for (var i = 0, j = lines.length; i < j; ++i) {
                if ((parts = gecko.exec(lines[i]))) {
                    element = {
                        'url': parts[3],
                        'func': parts[1] || UNKNOWN_FUNCTION,
                        'args': parts[2] ? parts[2].split(',') : '',
                        'line': +parts[4],
                        'column': parts[5] ? +parts[5] : null
                    };
                } else if ((parts = chrome.exec(lines[i]))) {
                    element = {
                        'url': parts[2],
                        'func': parts[1] || UNKNOWN_FUNCTION,
                        'line': +parts[3],
                        'column': parts[4] ? +parts[4] : null
                    };
                } else {
                    continue;
                }
    
                if (!element.func && element.line) {
                    element.func = guessFunctionName(element.url, element.line);
                }
    
                if (element.line) {
                    element.context = gatherContext(element.url, element.line);
                }
    
                stack.push(element);
            }
    
            if (stack[0] && stack[0].line && !stack[0].column && reference) {
                stack[0].column = findSourceInLine(reference[1], stack[0].url, stack[0].line);
            }
    
            if (!stack.length) {
                return null;
            }
    
            return {
                'mode': 'stack',
                'name': ex.name,
                'message': ex.message,
                'url': document.location.href,
                'stack': stack
            };
        }
    
        /**
         * Computes stack trace information from the stacktrace property.
         * Opera 10 uses this property.
         * @param {Error} ex
         * @return {?Object.<string, *>} Stack trace information.
         */
        function computeStackTraceFromStacktraceProp(ex) {
            // Access and store the stacktrace property before doing ANYTHING
            // else to it because Opera is not very good at providing it
            // reliably in other circumstances.
            var stacktrace = ex.stacktrace;
    
            var testRE = / line (\d+), column (\d+) in (?:<anonymous function: ([^>]+)>|([^\)]+))\((.*)\) in (.*):\s*$/i,
                lines = stacktrace.split('\n'),
                stack = [],
                parts;
    
            for (var i = 0, j = lines.length; i < j; i += 2) {
                if ((parts = testRE.exec(lines[i]))) {
                    var element = {
                        'line': +parts[1],
                        'column': +parts[2],
                        'func': parts[3] || parts[4],
                        'args': parts[5] ? parts[5].split(',') : [],
                        'url': parts[6]
                    };
    
                    if (!element.func && element.line) {
                        element.func = guessFunctionName(element.url, element.line);
                    }
                    if (element.line) {
                        try {
                            element.context = gatherContext(element.url, element.line);
                        } catch (exc) {}
                    }
    
                    if (!element.context) {
                        element.context = [lines[i + 1]];
                    }
    
                    stack.push(element);
                }
            }
    
            if (!stack.length) {
                return null;
            }
    
            return {
                'mode': 'stacktrace',
                'name': ex.name,
                'message': ex.message,
                'url': document.location.href,
                'stack': stack
            };
        }
    
        /**
         * NOT TESTED.
         * Computes stack trace information from an error message that includes
         * the stack trace.
         * Opera 9 and earlier use this method if the option to show stack
         * traces is turned on in opera:config.
         * @param {Error} ex
         * @return {?Object.<string, *>} Stack information.
         */
        function computeStackTraceFromOperaMultiLineMessage(ex) {
            // Opera includes a stack trace into the exception message. An example is:
            //
            // Statement on line 3: Undefined variable: undefinedFunc
            // Backtrace:
            //   Line 3 of linked script file://localhost/Users/andreyvit/Projects/TraceKit/javascript-client/sample.js: In function zzz
            //         undefinedFunc(a);
            //   Line 7 of inline#1 script in file://localhost/Users/andreyvit/Projects/TraceKit/javascript-client/sample.html: In function yyy
            //           zzz(x, y, z);
            //   Line 3 of inline#1 script in file://localhost/Users/andreyvit/Projects/TraceKit/javascript-client/sample.html: In function xxx
            //           yyy(a, a, a);
            //   Line 1 of function script
            //     try { xxx('hi'); return false; } catch(ex) { TraceKit.report(ex); }
            //   ...
    
            var lines = ex.message.split('\n');
            if (lines.length < 4) {
                return null;
            }
    
            var lineRE1 = /^\s*Line (\d+) of linked script ((?:file|http|https)\S+)(?:: in function (\S+))?\s*$/i,
                lineRE2 = /^\s*Line (\d+) of inline#(\d+) script in ((?:file|http|https)\S+)(?:: in function (\S+))?\s*$/i,
                lineRE3 = /^\s*Line (\d+) of function script\s*$/i,
                stack = [],
                scripts = document.getElementsByTagName('script'),
                inlineScriptBlocks = [],
                parts,
                i,
                len,
                source;
    
            for (i in scripts) {
                if (_has(scripts, i) && !scripts[i].src) {
                    inlineScriptBlocks.push(scripts[i]);
                }
            }
    
            for (i = 2, len = lines.length; i < len; i += 2) {
                var item = null;
                if ((parts = lineRE1.exec(lines[i]))) {
                    item = {
                        'url': parts[2],
                        'func': parts[3],
                        'line': +parts[1]
                    };
                } else if ((parts = lineRE2.exec(lines[i]))) {
                    item = {
                        'url': parts[3],
                        'func': parts[4]
                    };
                    var relativeLine = (+parts[1]); // relative to the start of the <SCRIPT> block
                    var script = inlineScriptBlocks[parts[2] - 1];
                    if (script) {
                        source = getSource(item.url);
                        if (source) {
                            source = source.join('\n');
                            var pos = source.indexOf(script.innerText);
                            if (pos >= 0) {
                                item.line = relativeLine + source.substring(0, pos).split('\n').length;
                            }
                        }
                    }
                } else if ((parts = lineRE3.exec(lines[i]))) {
                    var url = window.location.href.replace(/#.*$/, ''),
                        line = parts[1];
                    var re = new RegExp(escapeCodeAsRegExpForMatchingInsideHTML(lines[i + 1]));
                    source = findSourceInUrls(re, [url]);
                    item = {
                        'url': url,
                        'line': source ? source.line : line,
                        'func': ''
                    };
                }
    
                if (item) {
                    if (!item.func) {
                        item.func = guessFunctionName(item.url, item.line);
                    }
                    var context = gatherContext(item.url, item.line);
                    var midline = (context ? context[Math.floor(context.length / 2)] : null);
                    if (context && midline.replace(/^\s*/, '') === lines[i + 1].replace(/^\s*/, '')) {
                        item.context = context;
                    } else {
                        // if (context) alert("Context mismatch. Correct midline:\n" + lines[i+1] + "\n\nMidline:\n" + midline + "\n\nContext:\n" + context.join("\n") + "\n\nURL:\n" + item.url);
                        item.context = [lines[i + 1]];
                    }
                    stack.push(item);
                }
            }
            if (!stack.length) {
                return null; // could not parse multiline exception message as Opera stack trace
            }
    
            return {
                'mode': 'multiline',
                'name': ex.name,
                'message': lines[0],
                'url': document.location.href,
                'stack': stack
            };
        }
    
        /**
         * Adds information about the first frame to incomplete stack traces.
         * Safari and IE require this to get complete data on the first frame.
         * @param {Object.<string, *>} stackInfo Stack trace information from
         * one of the compute* methods.
         * @param {string} url The URL of the script that caused an error.
         * @param {(number|string)} lineNo The line number of the script that
         * caused an error.
         * @param {string=} message The error generated by the browser, which
         * hopefully contains the name of the object that caused the error.
         * @return {boolean} Whether or not the stack information was
         * augmented.
         */
        function augmentStackTraceWithInitialElement(stackInfo, url, lineNo, message) {
            var initial = {
                'url': url,
                'line': lineNo
            };
    
            if (initial.url && initial.line) {
                stackInfo.incomplete = false;
    
                if (!initial.func) {
                    initial.func = guessFunctionName(initial.url, initial.line);
                }
    
                if (!initial.context) {
                    initial.context = gatherContext(initial.url, initial.line);
                }
    
                var reference = / '([^']+)' /.exec(message);
                if (reference) {
                    initial.column = findSourceInLine(reference[1], initial.url, initial.line);
                }
    
                if (stackInfo.stack.length > 0) {
                    if (stackInfo.stack[0].url === initial.url) {
                        if (stackInfo.stack[0].line === initial.line) {
                            return false; // already in stack trace
                        } else if (!stackInfo.stack[0].line && stackInfo.stack[0].func === initial.func) {
                            stackInfo.stack[0].line = initial.line;
                            stackInfo.stack[0].context = initial.context;
                            return false;
                        }
                    }
                }
    
                stackInfo.stack.unshift(initial);
                stackInfo.partial = true;
                return true;
            } else {
                stackInfo.incomplete = true;
            }
    
            return false;
        }
    
        /**
         * Computes stack trace information by walking the arguments.caller
         * chain at the time the exception occurred. This will cause earlier
         * frames to be missed but is the only way to get any stack trace in
         * Safari and IE. The top frame is restored by
         * {@link augmentStackTraceWithInitialElement}.
         * @param {Error} ex
         * @return {?Object.<string, *>} Stack trace information.
         */
        function computeStackTraceByWalkingCallerChain(ex, depth) {
            var functionName = /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i,
                stack = [],
                funcs = {},
                recursion = false,
                parts,
                item,
                source;
    
            for (var curr = computeStackTraceByWalkingCallerChain.caller; curr && !recursion; curr = curr.caller) {
                if (curr === computeStackTrace || curr === TraceKit.report) {
                    // console.log('skipping internal function');
                    continue;
                }
    
                item = {
                    'url': null,
                    'func': UNKNOWN_FUNCTION,
                    'line': null,
                    'column': null
                };
    
                if (curr.name) {
                    item.func = curr.name;
                } else if ((parts = functionName.exec(curr.toString()))) {
                    item.func = parts[1];
                }
    
                if ((source = findSourceByFunctionBody(curr))) {
                    item.url = source.url;
                    item.line = source.line;
    
                    if (item.func === UNKNOWN_FUNCTION) {
                        item.func = guessFunctionName(item.url, item.line);
                    }
    
                    var reference = / '([^']+)' /.exec(ex.message || ex.description);
                    if (reference) {
                        item.column = findSourceInLine(reference[1], source.url, source.line);
                    }
                }
    
                if (funcs['' + curr]) {
                    recursion = true;
                }else{
                    funcs['' + curr] = true;
                }
    
                stack.push(item);
            }
    
            if (depth) {
                // console.log('depth is ' + depth);
                // console.log('stack is ' + stack.length);
                stack.splice(0, depth);
            }
    
            var result = {
                'mode': 'callers',
                'name': ex.name,
                'message': ex.message,
                'url': document.location.href,
                'stack': stack
            };
            augmentStackTraceWithInitialElement(result, ex.sourceURL || ex.fileName, ex.line || ex.lineNumber, ex.message || ex.description);
            return result;
        }
    
        /**
         * Computes a stack trace for an exception.
         * @param {Error} ex
         * @param {(string|number)=} depth
         */
        function computeStackTrace(ex, depth) {
            var stack = null;
            depth = (depth == null ? 0 : +depth);
    
            try {
                // This must be tried first because Opera 10 *destroys*
                // its stacktrace property if you try to access the stack
                // property first!!
                stack = computeStackTraceFromStacktraceProp(ex);
                if (stack) {
                    return stack;
                }
            } catch (e) {
                if (debug) {
                    throw e;
                }
            }
    
            try {
                stack = computeStackTraceFromStackProp(ex);
                if (stack) {
                    return stack;
                }
            } catch (e) {
                if (debug) {
                    throw e;
                }
            }
    
            try {
                stack = computeStackTraceFromOperaMultiLineMessage(ex);
                if (stack) {
                    return stack;
                }
            } catch (e) {
                if (debug) {
                    throw e;
                }
            }
    
            try {
                stack = computeStackTraceByWalkingCallerChain(ex, depth + 1);
                if (stack) {
                    return stack;
                }
            } catch (e) {
                if (debug) {
                    throw e;
                }
            }
    
            return {
                'mode': 'failed'
            };
        }
    
        /**
         * Logs a stacktrace starting from the previous call and working down.
         * @param {(number|string)=} depth How many frames deep to trace.
         * @return {Object.<string, *>} Stack trace information.
         */
        function computeStackTraceOfCaller(depth) {
            depth = (depth == null ? 0 : +depth) + 1; // "+ 1" because "ofCaller" should drop one frame
            try {
                throw new Error();
            } catch (ex) {
                return computeStackTrace(ex, depth + 1);
            }
        }
    
        computeStackTrace.augmentStackTraceWithInitialElement = augmentStackTraceWithInitialElement;
        computeStackTrace.guessFunctionName = guessFunctionName;
        computeStackTrace.gatherContext = gatherContext;
        computeStackTrace.ofCaller = computeStackTraceOfCaller;
    
        return computeStackTrace;
    }());
    
    /**
     * Extends support for global error handling for asynchronous browser
     * functions. Adopted from Closure Library's errorhandler.js
     */
    (function extendToAsynchronousCallbacks() {
        var _helper = function _helper(fnName) {
            var originalFn = window[fnName];
            window[fnName] = function traceKitAsyncExtension() {
                // Make a copy of the arguments
                var args = _slice.call(arguments);
                var originalCallback = args[0];
                if (typeof (originalCallback) === 'function') {
                    args[0] = TraceKit.wrap(originalCallback);
                }
                // IE < 9 doesn't support .call/.apply on setInterval/setTimeout, but it
                // also only supports 2 argument and doesn't care what "this" is, so we
                // can just call the original function directly.
                if (originalFn.apply) {
                    return originalFn.apply(this, args);
                } else {
                    return originalFn(args[0], args[1]);
                }
            };
        };
    
        _helper('setTimeout');
        _helper('setInterval');
    }());
    
    //Default options:
    if (!TraceKit.remoteFetching) {
      TraceKit.remoteFetching = true;
    }
    if (!TraceKit.collectWindowErrors) {
      TraceKit.collectWindowErrors = true;
    }
    if (!TraceKit.linesOfContext || TraceKit.linesOfContext < 1) {
      // 5 lines before, the offending line, 5 lines after
      TraceKit.linesOfContext = 11;
    }
    
    
    
    // Export to global object
    window.TraceKit = TraceKit;
    
    }(window));
    
    "use strict";
    /*
     * Bugsense JavaScript SDK v1.1.1
     * http://bugsense.com/
     *
     * Copyright 2013 Splunk Inc.
     *
     */
    
    var timestamp = function() {
      return (new Date()).getTime();
    };
    
    var extend = function(obj) {
      each(slice.call(arguments, 1), function(source) {
        if (source) {
          for (var prop in source) {
            obj[prop] = source[prop];
          }
        }
      });
      return obj;
    };
    var _has = function(object, key) {
      return Object.prototype.hasOwnProperty.call(object, key);
    }
    
    // BEGIN - Extracted from Zepto
    var escape = encodeURIComponent;
    
    Object.keys = Object.keys || function(o) { 
      var result = []; 
      for(var name in o) { 
        if (o.hasOwnProperty(name)) 
          result.push(name); 
      } 
      return result; 
    };
    
    var isObject = function isObject ( instance ) {
      return instance instanceof Object;
    };
    var array = []
    
    var slice = array.slice;
    
    var isArray = function isArray ( instance ) {
      return instance instanceof Array;
    };
    
    var isValidKeyValue = function isValidKeyValue ( instance ) {
      return ( typeof(instance) == 'string' || typeof(instance) == 'number' || typeof(instance) == 'boolean' );
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
    
    var breaker = {};
    var each = function(obj, iterator, context) {
      if (obj == null) return;
      var nativeForEach = Array.prototype.forEach;
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, length = obj.length; i < length; i++) {
          if (iterator.call(context, obj[i], i, obj) === breaker) return;
        }
      } else {
        var keys = _.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
          if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
        }
      }
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
      // return params.join( '&' ).replace( /%20/g, '+' );
      return params.join( '&' );
    };
      // END - Extracted from Zepto
    
    var generator = function GUIDGenerator() {
      var S4 = function () {
        return Math.floor(
          Math.random() * 0x10000 /* 65536 */
        ).toString(16);
      };
      return (
         S4() + S4() + "-" +
         S4() + "-" +
         S4() + "-" +
         S4() + "-" +
         S4() + S4() + S4()
       );
    }
    
    // Extracted from Backbone;
    // Regular expression used to split event strings.
    var eventSplitter = /\s+/;
    
    // Implement fancy features of the Events API such as multiple event
    // names `"change blur"` and jQuery-style event maps `{change: action}`
    // in terms of the existing API.
    var eventsApi = function(obj, action, name, rest) {
      if (!name) return true;
    
      // Handle event maps.
      if (typeof name === 'object') {
        for (var key in name) {
          obj[action].apply(obj, [key, name[key]].concat(rest));
        }
        return false;
      }
    
      // Handle space separated event names.
      if (eventSplitter.test(name)) {
        var names = name.split(eventSplitter);
        for (var i = 0, l = names.length; i < l; i++) {
          obj[action].apply(obj, [names[i]].concat(rest));
        }
        return false;
      }
    
      return true;
    };
    
    // A difficult-to-believe, but optimized internal dispatch function for
    // triggering events. Tries to keep the usual cases speedy (most internal
    // Backbone events have 3 arguments).
    var triggerEvents = function(events, args) {
      var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
      switch (args.length) {
        case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
        case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
        case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
        case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
        default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
      }
    };
    var _once = function(func) {
      var ran = false, memo;
      return function() {
        if (ran) return memo;
        ran = true;
        memo = func.apply(this, arguments);
        func = null;
        return memo;
      };
    };
    
    (function(root, factory) {
    
      if (typeof define === 'function' && define.amd) {
        define('lockr', ['exports'], function(exports) {
          root.Lockr = factory(root, exports);
        });
      } else {
        root.Lockr = factory(root, {});
      }
    
    }(this, function(root, Lockr) {
      'use strict';
    
      root.Lockr = Lockr;
    
      if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(elt /*, from*/)
        {
          var len = this.length >>> 0;
    
          var from = Number(arguments[1]) || 0;
          from = (from < 0)
          ? Math.ceil(from)
          : Math.floor(from);
          if (from < 0)
            from += len;
    
          for (; from < len; from++)
          {
            if (from in this &&
                this[from] === elt)
              return from;
          }
          return -1;
        };
      }
    
      Lockr.prefix = "";
    
      Lockr._getPrefixedKey = function(key, options) {
        options = options || {};
    
        if (options.noPrefix) {
          return key;
        } else {
          return this.prefix + key;
        }
    
      };
    
      Lockr.set = function (key, value, options) {
        var query_key = this._getPrefixedKey(key, options);
    
        try {
          localStorage.setItem(query_key, JSON.stringify({"data": value}));
        } catch (e) {
          if (console) console.warn("Lockr didn't successfully save the '{"+ key +": "+ value +"}' pair, because the localStorage is full.");
        }
      };
    
      Lockr.get = function (key, missing, options) {
        var query_key = this._getPrefixedKey(key, options),
            value;
    
        try {
          value = JSON.parse(localStorage.getItem(query_key));
        } catch (e) {
          value = null;
        }
        if(value === null)
          return missing;
        else
          return (value.data || missing);
      };
    
      Lockr.sadd = function(key, value, options) {
        var query_key = this._getPrefixedKey(key, options),
            json;
    
        var values = Lockr.smembers(key);
    
        if (values.indexOf(value) > -1) {
          return null;
        }
    
        try {
          values.push(value);
          json = JSON.stringify({"data": values});
          localStorage.setItem(query_key, json);
        } catch (e) {
          console.log(e);
          if (console) console.warn("Lockr didn't successfully add the "+ value +" to "+ key +" set, because the localStorage is full.");
        }
      };
    
      Lockr.smembers = function(key, options) {
        var query_key = this._getPrefixedKey(key, options),
            value;
    
        try {
          value = JSON.parse(localStorage.getItem(query_key));
        } catch (e) {
          value = null;
        }
    
        if (value === null)
          return [];
        else
          return (value.data || []);
      };
    
      Lockr.sismember = function(key, value, options) {
        var query_key = this._getPrefixedKey(key, options);
    
        return Lockr.smembers(key).indexOf(value) > -1;
      };
    
      Lockr.getAll = function () {
        var keys = Object.keys(localStorage);
    
        return keys.map(function (key) {
          return Lockr.get(key);
        });
      };
    
      Lockr.srem = function(key, value, options) {
        var query_key = this._getPrefixedKey(key, options),
            json,
            index;
    
        var values = Lockr.smembers(key, value);
    
        index = values.indexOf(value);
    
        if (index > -1)
          values.splice(index, 1);
    
        json = JSON.stringify({"data": values});
    
        try {
          localStorage.setItem(query_key, json);
        } catch (e) {
          if (console) console.warn("Lockr couldn't remove the "+ value +" from the set "+ key);
        }
      };
    
      Lockr.rm =  function (key) {
        localStorage.removeItem(key);
      };
    
      Lockr.flush = function () {
        localStorage.clear();
      };
      return Lockr;
    
    }));
    
    var md5cycle = function(x, k) {
      var a = x[0], b = x[1], c = x[2], d = x[3];
    
      a = ff(a, b, c, d, k[0], 7, -680876936);
      d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17,  606105819);
      b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897);
      d = ff(d, a, b, c, k[5], 12,  1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341);
      b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7,  1770035416);
      d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063);
      b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7,  1804603682);
      d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290);
      b = ff(b, c, d, a, k[15], 22,  1236535329);
    
      a = gg(a, b, c, d, k[1], 5, -165796510);
      d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14,  643717713);
      b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691);
      d = gg(d, a, b, c, k[10], 9,  38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335);
      b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5,  568446438);
      d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961);
      b = gg(b, c, d, a, k[8], 20,  1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467);
      d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14,  1735328473);
      b = gg(b, c, d, a, k[12], 20, -1926607734);
    
      a = hh(a, b, c, d, k[5], 4, -378558);
      d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16,  1839030562);
      b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060);
      d = hh(d, a, b, c, k[4], 11,  1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632);
      b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4,  681279174);
      d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979);
      b = hh(b, c, d, a, k[6], 23,  76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487);
      d = hh(d, a, b, c, k[12], 11, -421815835);
      c = hh(c, d, a, b, k[15], 16,  530742520);
      b = hh(b, c, d, a, k[2], 23, -995338651);
    
      a = ii(a, b, c, d, k[0], 6, -198630844);
      d = ii(d, a, b, c, k[7], 10,  1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905);
      b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6,  1700485571);
      d = ii(d, a, b, c, k[3], 10, -1894986606);
      c = ii(c, d, a, b, k[10], 15, -1051523);
      b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6,  1873313359);
      d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380);
      b = ii(b, c, d, a, k[13], 21,  1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070);
      d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15,  718787259);
      b = ii(b, c, d, a, k[9], 21, -343485551);
    
      x[0] = add32(a, x[0]);
      x[1] = add32(b, x[1]);
      x[2] = add32(c, x[2]);
      x[3] = add32(d, x[3]);
    
    }
    
    var cmn = function(q, a, b, x, s, t) {
      a = add32(add32(a, q), add32(x, t));
      return add32((a << s) | (a >>> (32 - s)), b);
    }
    
    var ff = function(a, b, c, d, x, s, t) {
      return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    
    var gg = function(a, b, c, d, x, s, t) {
      return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    
    var hh = function(a, b, c, d, x, s, t) {
      return cmn(b ^ c ^ d, a, b, x, s, t);
    }
    
    var ii = function(a, b, c, d, x, s, t) {
      return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }
    
    var md51 = function(s) {
      var txt = '';
      var n = s.length,
          state = [1732584193, -271733879, -1732584194, 271733878], i;
      for (i=64; i<=s.length; i+=64) {
        md5cycle(state, md5blk(s.substring(i-64, i)));
      }
      s = s.substring(i-64);
      var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
      for (i=0; i<s.length; i++)
        tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
      tail[i>>2] |= 0x80 << ((i%4) << 3);
      if (i > 55) {
        md5cycle(state, tail);
        for (i=0; i<16; i++) tail[i] = 0;
      }
      tail[14] = n*8;
      md5cycle(state, tail);
      return state;
    }
    
    var md5blk = function(s) { /* I figured global was faster.   */
      var md5blks = [], i; /* Andy King said do it this way. */
      for (i=0; i<64; i+=4) {
        md5blks[i>>2] = s.charCodeAt(i)
          + (s.charCodeAt(i+1) << 8)
          + (s.charCodeAt(i+2) << 16)
          + (s.charCodeAt(i+3) << 24);
      }
      return md5blks;
    }
    
    var hex_chr = '0123456789abcdef'.split('');
    
    var rhex = function(n) {
      var s='', j=0;
      for(; j<4; j++)
        s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
          + hex_chr[(n >> (j * 8)) & 0x0F];
      return s;
    }
    
    var hex = function(x) {
      for (var i=0; i<x.length; i++)
        x[i] = rhex(x[i]);
      return x.join('');
    }
    
    var md5 = function(s) {
      return hex(md51(s));
    }
    
    var add32 = function(a, b) {
      return (a + b) & 0xFFFFFFFF;
    }
    
    if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
      var add32 = function(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
      }
    }
    
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
    
    Bugsense.Crashes = (function() {
    
      Bugsense.breadcrumbs = [];
      Bugsense.extraData = {};
    
      /* Extra Data functions */
      Bugsense.addExtraData = function (key, value) {
        if ( isValidKeyValue( key ) && isValidKeyValue( value ) ) {
          Bugsense.extraData[ key ] = value;
        }
      };
      Bugsense.removeExtraData = function( key ) {
        delete Bugsense.extraData[ key ];
      };
      Bugsense.clearExtraData = function() {
        Bugsense.extraData = {};
      };
    
      /* Breadcrumbs */
      Bugsense.leaveBreadcrumb = function( breadcrumb ) {
        if ( isValidKeyValue( breadcrumb ) ) {
          if ( Bugsense.breadcrumbs.length + 1 == 16 ) {
            Bugsense.breadcrumbs = Bugsense.breadcrumbs.slice( 1 );
          }
          Bugsense.breadcrumbs.push( breadcrumb );
        }
      };
      Bugsense.clearBreadcrumbs = function() {
        Bugsense.breadcrumbs = [];
      };
      
    }());
    
    Bugsense.channel = function() {
      // Bind an event to a `callback` function. Passing `"all"` will bind
      // the callback to all events fired.
      // Extracted from Backbone;
      // Regular expression used to split event strings.
      var eventSplitter = /\s+/;
      // Implement fancy features of the Events API such as multiple event
      // names `"change blur"` and jQuery-style event maps `{change: action}`
      // in terms of the existing API.
      var eventsApi = function(obj, action, name, rest) {
        if (!name) return true;
    
        // Handle event maps.
        if (typeof name === 'object') {
          for (var key in name) {
            obj[action].apply(obj, [key, name[key]].concat(rest));
          }
          return false;
        }
    
        // Handle space separated event names.
        if (eventSplitter.test(name)) {
          var names = name.split(eventSplitter);
          for (var i = 0, l = names.length; i < l; i++) {
            obj[action].apply(obj, [names[i]].concat(rest));
          }
          return false;
        }
    
        return true;
      };
    
      // A difficult-to-believe, but optimized internal dispatch function for
      // triggering events. Tries to keep the usual cases speedy (most internal
      // Backbone events have 3 arguments).
      var triggerEvents = function(events, args) {
        var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
        switch (args.length) {
          case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
          case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
          case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
          case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
          default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
        }
      };
      var _once = function(func) {
        var ran = false, memo;
        return function() {
          if (ran) return memo;
          ran = true;
          memo = func.apply(this, arguments);
          func = null;
          return memo;
        };
      };
      // 
      Bugsense.on = function(name, callback, context) {
        if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
        this._events || (this._events = {});
        var events = this._events[name] || (this._events[name] = []);
        events.push({callback: callback, context: context, ctx: context || this});
        return this;
      };
    
      // Bind an event to only be triggered a single time. After the first time
      // the callback is invoked, it will be removed.
      Bugsense.once = function(name, callback, context) {
        if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
        var self = this;
        var once = _once(function() {
          self.off(name, once);
          callback.apply(this, arguments);
        });
        once._callback = callback;
        return this.on(name, once, context);
      };
    
      // Remove one or many callbacks. If `context` is null, removes all
      // callbacks with that function. If `callback` is null, removes all
      // callbacks for the event. If `name` is null, removes all bound
      // callbacks for all events.
      Bugsense.off = function(name, callback, context) {
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
      };
    
      // Trigger one or many events, firing all bound callbacks. Callbacks are
      // passed the same arguments as `trigger` is, apart from the event name
      // (unless you're listening on `"all"`, which will cause your callback to
      // receive the true name of the event as the first argument).
      Bugsense.trigger = function(name) {
        if (!this._events) return this;
        var args = slice.call(arguments, 1);
        if (!eventsApi(this, 'trigger', name, args)) return this;
        var events = this._events[name];
        var allEvents = this._events.all;
        if (events) triggerEvents(events, args);
        if (allEvents) triggerEvents(allEvents, arguments);
        return this;
      };
    
    }();
    
    Bugsense.Cache = (function() {
      var Cache = {
        _queue: [],
        cacheReport: function(data) {
          this._queue.push(data);
          this.update();
        },
        retrieve: function () {
          var data = Lockr.get('bugsense_cache');
          this._queue = data || [];
          if (this._queue.length)
            this.sendCachedReport();
        },
        update: function () {
          Lockr.set('bugsense_cache', this._queue);
        },
        sendCachedReport: function() {
          // do stuff here
          if(this._queue.length) {
            var that = this;
            each(this._queue, function(data, index) {
              Bugsense.Network.send(data, 'POST');
              that._queue.shift(index);
            });
            this.update();
          } else {
            return false;
          }
        }
      };
    
      return Cache;
    }());
    
    Bugsense.Errors = (function () {
    
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
        var stack = data.errorobj ? data.errorobj.stack : data.stack || null;
        var parsedError = { // Chrome
          message: data.exception || data.message,
          url: data.url || data.lineNumber || data.sourceURL,
          line: data.line,
          stack: stack,
        };
        parsedError.custom_data = data.custom_data || {};
    
        return parsedError;
      };
    
      var generateExceptionData = function(error, unhandled) {
        var message = ( typeof(error) != "string" ) ? error.message : error,
            crash = {},
            stacktrace = getStackTrace(error),
            url = error.url || error.lineNumber || error.sourceUrl,
            line = error.line,
            klass = url && line ? TraceKit.computeStackTrace.guessFunctionName(url, line) : "unknown";
        // errorHash = this.computeErrorHash(this.getOffendingLine(stacktrace, line), msg[1], line, klass, this.dataFixture.appVersion)
            //
    
        unhandled = unhandled || false;
    
        crash = extend(Bugsense.generateFixture(), {
          'exception': {
            'message': message,
            'where': [ url, line ].join( ':' ),
            'klass': klass,
            'backtrace': (stacktrace && stacktrace.length) ? stacktrace : [],
            'breadcrumbs': Bugsense.breadcrumbs,
          },
          'request': {
            'user_id': (Bugsense.config.userIdentifier || 'unknown'),
            'handled': unhandled ? 0 : 1
          }
        });
        crash.application_environment.log_data = extend(Bugsense.extraData, error.custom_data)
    
        return crash;
      };
    
      var generateStackTrace = function(error) {
        var stack = TraceKit.computeStackTrace(error).stack;
        if (stack) {
          return stack.map(function(s) {
            return s.func+"@"+s.url+":"+s.line;
          });
        } else {
          return [];
        }
      };
      var getStackTrace = function(error) {
        return error.stack || generateStackTrace(error);
      };
    
    
      Bugsense.notify = function(data, custom_data, unhandled) {
        var parsedError = {};
        if(custom_data) data.custom_data = custom_data;
        parsedError = parse(data);
    
        Bugsense.Network.send(generateExceptionData(parsedError, unhandled), 'POST');
      };
    
      window.onerror = function(exception, url, line, column, errorobj) {
        if(!Bugsense.config.disableOnError) {
          if(Bugsense.config.apiKey) {
            Bugsense.trigger('crash');
    
            Bugsense.notify({
              exception: exception,
              url: url,
              line: line,
              column: column,
              errorobj: errorobj
            }, undefined, true);
          } else {
            var msg = 'You need a BugSense API key to use bugsense.js.';
            if('warn' in console && !Bugsense.config.silent) console.warn(msg)
            else console.log(msg);
          }
        }
      };
    
      return {
        parse: parse,
        computeErrorHash: computeErrorHash,
        generateExceptionData: generateExceptionData
      }
    }());
    
    Bugsense.Sessions = (function () {
      var generator = function GUIDGenerator() {
        var S4 = function () {
          return Math.floor(
            Math.random() * 0x10000 /* 65536 */
          ).toString(16);
        };
        return (
          S4() + S4() + "-" +
          S4() + "-" +
          S4() + "-" +
          S4() + "-" +
          S4() + S4() + S4()
        );
      }
    
      var Sessions = {
        generateUid: function() {
          var uid = Lockr.get('bugsense:uid') || generator();
          Lockr.set('bugsense:uid', uid);
          return uid;
        }
      }
    
      return Sessions;
    }());
    
    Bugsense.Network = (function() {
    
      var Network = {
        getPostURL: function() {
          return Bugsense.config.url + '?cacheBuster=' + timestamp();
        },
        send: function(data, method) {
          // Send the data over to Bugsense
          var net = new XMLHttpRequest();
          net.open(method, this.getPostURL(), true );
          net.setRequestHeader('X-BugSense-Api-Key', Bugsense.config.apiKey);
          net.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          net.onerror = function () {
            /* cache the report */
            Bugsense.Cache.cacheReport(data);
          }
          function successHandler() {
            if (net && net.readyState != 4) { return; }
            if (net && net.status != 200) {
              return false;
            }
            // some console.log implementations don't support multiple parameters, guess it's okay in this case to concatenate
            if ('console' in window && !Bugsense.config.silent) {
              console.log('logged 1 error to Bugsense, status: ' + net.responseText);
            }
          };
    
          net.onreadystatechange = successHandler;
          net.send(param({ data: JSON.stringify(data) }));
        }
      };
      return Network;
    }());

    return Bugsense;
}));