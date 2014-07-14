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
