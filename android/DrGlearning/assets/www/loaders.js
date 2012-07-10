/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/
/*global
    Ext Jed i18n FBL DEBUG yepnope PhoneGap MathJax JSON console printStackTrace alert DrGlearning
*/

var VERSION = "0.2.2", TERMS_VERSION = "0.2.2";

function StackTrace(ex) {
    var logger, msg;
    if (typeof(DEBUG) !== "undefined" && DEBUG) {
        try {
            msg = printStackTrace().join("\n-> ") + "\n @ " + ex;
        } catch (ex1) {
            msg = ex;
        }
        msg = (msg || "<None>").toString();
        try {
            navigator.notification.alert(msg);
        } catch (ex2) {
            try {
                alert(msg);
            } catch (ex3) {
                document.getElementById("stackLogger").style.display = "block";
                logger = document.getElementById("stackLogger");
                // It is a DOM element, so we have to watch the space
                logger.innerHTML = "LOG: " + msg.substring(0, 100) + "<br/>" + logger.innerHTML.substring(0, 300);
            }
        } finally {
            console.log(msg);
        }
    } else {
        console.log(ex);
    }
    if (typeof(DrGlearning) !== 'undefined') {
        try {
            DrGlearning.app.getController('GlobalSettingsController').toHome();
        } catch (ex4) {
            console.log("Failed at showing Home screen");
        }
    }
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

        function load() {
            // Loaders
            yepnope([{
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
        }

        // Debug loaders
        if (typeof(DEBUG) !== "undefined") {
            yepnope([{
                // Debug mode remote
                test: DEBUG === "remote",
                yep: "http://debug.phonegap.com/target/target-script-min.js#drglearning"
            }, {
                // Debug mode Firebug
                test: DEBUG === "firebug",
                yep: "https://getfirebug.com/firebug-lite-debug.js"
            }, {
                // Debug mode console
                load: "resources/js/stacktrace-min-0.3.js",
                complete: function () {
                    if (typeof(FBL) !== "undefined") {
                        FBL.Firebug.chrome.close();
                        window.console = FBL.Firebug.Console;
                    }
                    if (DEBUG === "alert") {
                        if (navigator && typeof(navigator.notification) !== "undefined") {
                            window.console = {log: (function (msg) {
                                navigator.notification.alert("LOG: " + msg);
                            })};
                        } else if (typeof(window.alert) !== "undefined") {
                            window.console = {log: (function (msg) {
                                window.alert.call(window, "LOG: " + msg);
                            })};
                        }
                    } else if (DEBUG === "html") {
                        document.getElementById("stackLogger").style.display = "block";
                        window.console = {log: (function (msg) {
                            var logger;
                            msg = (msg || "<None>").toString();
                            logger = document.getElementById("stackLogger");
                            logger.innerHTML = "LOG: " + msg.substring(0, 100) + "<br/>" + logger.innerHTML.substring(0, 300);
                        })};
                    }
                    load();
                }
            }]);
        } else {
            load();
        }

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
