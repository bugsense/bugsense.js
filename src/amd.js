(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('bugsense', [], factory);
    } else {
        // Browser globals
        root.Bugsense = factory(root.b);
    }
}(this, function () {

    //= ../lib/bugsense.js

    return Bugsense;
}));

