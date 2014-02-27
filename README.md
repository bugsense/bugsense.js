# BugSense JavaScript SDK

[BugSense](http://www.bugsense.com) is the leading crash/quality reporting solution for Mobile developers. The bugsense.js libs brings this functionality to mobile web developers that develop mobile web apps, Phonegap apps and even Windows 8 Javascript apps.

## Installation

Store the bugsense.js file along with you other Javascript files. Alternatively you can use the BugSense hosted version (see the following snippet). Then, instanciate the plugin with the API key from your project:

```html
 <script src="http://www.bugsense.com/static/js/global/bugsense.js" type='text/javascript'></script>
 <script type="text/javascript">
    // You will find the API KEY in your BugSense Dashboard
    var bugsense = new Bugsense( { apiKey: 'YOUR_API_KEY' } );
 </script>
```


## Options
**```apiKey```** - API key for your BugSense project

default: ```{String} F00BAR```

**```url```** - ```{Object}``` This is the url of the Gateway the SDK is sending data to.

* ```protocol``` default: ```{String} https```
* ```host``` default: ```{String} bugsense.com```
* ```port``` default: ```{Int} 8080```
* ```apiVersion``` default: ```{String} 1.0```

**```appver```** - This is the current version code of your application.

default: ```{String} null```

**```userIdentifier```** - This is a identifier for each user, eg. "example@gmail.com" or a username

default: ```{String} null```

**```disableOnError```** - Disables the global error handler, in order to use bugsense only for handle exceptions with ```try {...} catch```

default: ```{Boolean} false```

----

## Registering handled exceptions
Bugsense.js allows you to register handled exception as well and append metadata to the crash report.
```js
try {
   rotateScreen();
} catch ( error ) {
   bugsense.notify( error, { rotation: 'not supported' } );
};
```

----

## ExtraData & Breadcrumbs
You can add extraData to the BugSense crash reports as well as breacrumbs to help you debug your app faster!

### Managing extraData
In order to add extra data in your instace, you can use the ```bugsense.addExtraData``` function.
```js
/* add metadata */
bugsense.addExtraData( 'user_level', 'paid' );
bugsense.addExtraData( 'account', 'CEO' );
```

If you want to remove extra data, you can use the ```bugsense.removeExtraData``` and passing the key as a parameter.
```js
/* Removing metadata by key */
bugsense.removeExtraData('user_level');
```

Or you can clear all metadata by using ```bugsense.clearExtraData```.
```js
/* Clear all metadata */
bugsense.clearExtraData();
```

### Managing Breadcrumbs
By adding breadcrumbs to your code you can easily see the trail the user followed before getting the crash. Just leave a breadcrumb by using ```bugsense.leaveBreadcrumb```.
```js
/* leave breadcrumb */
bugsense.leaveBreadcrumb( 'Fetch Friendlist' );
```
Also, you can also clear all breadcrumbs
```js
/* clear breadcrumbs */
bugsense.clearBreadcrumbs();
```

----

## Registering events
Bugsense.js provides an easy way for developers to use events in order to handle crashes more effectively.

```js
function ooops() {
  alert('Ooops! Our app just crashed. Please send us an email at support@example.com');
}
bugsense.on("crash", ooops);
```
When this is done, you can unregister the event to avoid spamming your users with countless alerts of notifications.
```js
bugsense.off("crash", ooops);
```

----

## Run SDK specs

### Terminal
In order the specs suites for bugsense.js, you should have node and npm install correctly. Then install dependencies, running the following command in the parent folder of this repo:

```
npm install
```

Also, you should have installed Grunt.js and PhantomJS. 

In order to install globally Grunt.js run:

```
npm install -g grunt-cli
```

In order to install PhantomJS, visit [their website](http://phantomjs.org/) and find the right package for you. If you're using Mac OS X, it's recommender to use Homebrew for installation:
```brew install phantomjs```

When all dependencies are installed, run ```grunt specs``` in order to run the whole suite. If you're developing you can watch your file changes with ```grunt watch```, which will then automatically run your specs.

### Browser
You can also run the specs in your browser. Open the ```_SpecRunner.html``` in your favorite browser or run ```open _SpecRunner.html``` in your terminal.


**Notes**:

* Older browser do not support the ```window.onerror``` callback and thefore the plugin will not receive any uncaught exception. 
* When there's only the Error object caught, error.stack will be parsed to get the url and line number.
* Deobfuscation or retracing for minified and/or obfuscated Javascript files is not supported yet.
* Bugsense.js uses CORS to send crash reports.
