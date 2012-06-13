/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/
/*global
    Ext Jed i18n FBL DEBUG, yepnope PhoneGap MathJax JSON console
*/
function onDeviceReady() {
    // Now safe to use the PhoneGap API
    console.log('LAUNCH!!!');
    if (typeof(this.getController) !== "undefined") {
        this.getController('LoadingController').onLaunch();
    }
}
// Loaders
yepnope([{
    // Debug mode remote
    test: typeof(DEBUG) !== "undefined" && DEBUG === "remote",
    yep: "http://debug.phonegap.com/target/target-script-min.js#drglearning"
}, {
    // Debug mode console
    test: typeof(DEBUG) !== "undefined" && DEBUG,
    yep: "https://getfirebug.com/firebug-lite-debug.js"
}, {
    // Locales
    test: ["es_ES", "fr", "en", "pt_BR"].indexOf(localStorage.locale) >= 0,
    yep: "resources/js/locales/" + localStorage.locale + ".js",
    nope: "resources/js/locales/en.js"
}, {
    // PhoneGap local vs. PhoneGap:Build
    test: typeof(PhoneGap) === "undefined",
    nope: "resources/js/cordova-1.7.0.js",
    complete: function () {
        document.addEventListener("deviceready", onDeviceReady, false);
    }
}, {
    // MathJax
    test: typeof(MathJax) === "undefined",
    yep: "resources/js/mathjax/MathJax.js"
}, {
    // JSON
    test: typeof(JSON) === "undefined",
    yep: "resources/js/json2.min.js"
}, {
    // Main
    load: "drglearningapp.js",
    complete: function () {
        if (typeof(FBL) !== "undefined") {
            FBL.Firebug.chrome.close();
        }
    }
}]);
