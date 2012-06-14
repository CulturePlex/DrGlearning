/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/
/*global
    Ext Jed i18n FBL DEBUG yepnope PhoneGap MathJax JSON console printStackTrace alert
*/

function StackTrace(ex) {
    window.alert(ex);
}

try {
    (function () {
    // Exceptions Catcher Begins

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
            // Debug mode Firebug
            test: typeof(DEBUG) !== "undefined" && DEBUG === "firebug",
            yep: "https://getfirebug.com/firebug-lite-debug.js"
        }, {
            // Debug mode console
            test: typeof(DEBUG) !== "undefined" && DEBUG,
            yep: "resources/js/stacktrace-min-0.3.js",
            complete: function () {
                if (typeof(FBL) !== "undefined") {
                    FBL.Firebug.chrome.close();
                    window.console = FBL.Firebug.Console;
                }
                if (DEBUG === "alert") {
                    window.console = {log: (function(msg) {
                        window.alert.call(window, msg);
                    })};
                }
                if (typeof(printStackTrace) !== "undefined") {
                    window.StackTrace = function (ex) {
                        window.alert.call(window, printStackTrace().join("\n-> ") + "\n @ " + ex);
                        console.log(ex);
                    };
                }
            }
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
            load: "drglearningapp.js"
        }]);

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
