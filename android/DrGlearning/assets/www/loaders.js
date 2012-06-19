/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/
/*global
    Ext Jed i18n FBL DEBUG yepnope PhoneGap MathJax JSON console printStackTrace alert
*/

function StackTrace(ex) {
    var logger, msg;
    if (typeof(DEBUG) !== "undefined" && DEBUG) {
        try {
            msg = printStackTrace().join("\n-> ") + "\n @ " + ex;
        } catch (ex) {
            msg = ex;
        }
        msg = (msg || "<None>").toString();
        try {
            navigator.notification.alert(msg);
        } catch (ex) {
            try {
                alert(msg);
            } catch (ex) {
                document.getElementById("stackLogger").style.display = "block";
                logger = document.getElementById("stackLogger");
                // It is a DOM element, so we have watch the space
                logger.innerHTML = "LOG: " + msg.substring(0, 100) + "<br/>" + logger.innerHTML.substring(0, 300);
            }
        } finally {
            console.log(msg);
        }
    } else {
        console.log(ex);
    }
}

try {
    (function () {
    // Exceptions Catcher Begins

        function onDeviceReady() {
            // Now safe to use the PhoneGap API
            if ((typeof(DEBUG) !== "undefined" && DEBUG === "alert") && (navigator && typeof(navigator.notification) !== "undefined")) {
                window.console = {log: (function (msg) {
                    navigator.notification.alert("LOG: " + msg);
                })};
            }
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
                if (typeof(DEBUG) !== "undefined") {
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
                }
            }
        }, {
            // Locales
            test: ["ar", "es_ES", "fr", "en", "pt_BR"].indexOf(localStorage.locale) >= 0,
            yep: "resources/js/locales/" + localStorage.locale + ".js",
            nope: "resources/js/locales/en.js"
        }, {
            // PhoneGap local vs. PhoneGap:Build
            test: typeof(PhoneGap) === "undefined",
            nope: "resources/js/cordova.js",
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
