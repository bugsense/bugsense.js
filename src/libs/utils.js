"use strict";
/*
 * Bugsense JavaScript SDK v1.1.1
 * http://bugsense.com/
 *
 * Copyright 2013 Splunk Inc.
 *
 */

var extend = function(obj) {
  each(slice.call(arguments, 1), function(source) {
    if (source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
}
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

var guid_generator = function GUIDGenerator() {
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
