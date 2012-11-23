# JavaScript BugSense Client

[BugSense](http://www.bugsense.com) is the leading crash/quality reporting solution for Mobile developers. The bugsense.js libs brings this functionality to mobile web developers that develop mobile web apps, Phonegap apps and even Windows 8 Javascript apps.

## Installing the plugin

Store the bugsense.js file along with you other Javascript files. Alternatively you can use the BugSense hosted version (see the following snipper).

```html
 <script src="http://www.bugsense.com/static/js/global/bugsense.js" type='text/javascript'></script>
 <script type="text/javascript">
    // You will find the API KEY in your BugSense Dashboard
    var bugsense = new Bugsense( { apiKey: 'YOUR_API_KEY' } );
 </script>
```

**Notes**:

* Older browser do not support the <i>window.onerror</i> callback and thefore the plugin will not receive any uncaught exception. 
* When there's only the Error object caught, error.stack will be parsed to get the url and line number.
* Deobfuscation or retracing for minified and/or obfuscated Javascript files is not supported yet.
* Bugsense.js uses CORS to send crash reports.


## Registering handled exceptions
Bugsense.js allows you to register handled exception as well and append metadata to the crash report.


```js
try { 
   rotateScreen(); 
} catch ( error ) { 
   bugsense.notify( error, { rotation: 'not supported' } ) 
};
```

## Metadata & Breadcrumbs
You can add metadata to the BugSense crash reports as well as breacrumbs to help you debug your app faster!

```js
// add metadata
bugsense.addExtraData( 'user_level', 'paid' );
bugsense.addExtraData( 'account', 'CEO' );

// Clear all metadata
bugsense.clearExtraData();

// leave breadcrumb
bugsense.leaveBreadcrumb( 'Fetch Friendlist' );
```