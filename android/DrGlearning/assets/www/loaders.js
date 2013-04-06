/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/
/*global
    Ext Jed i18n FBL DEBUG yepnope PhoneGap MathJax JSON console printStackTrace alert DrGlearning head
*/

var VERSION = "0.2.4", TERMS_VERSION = "0.2.4", LANGS = ["es_ES", "fr", "en", "pt_BR"];
// Disable Terms
delete TERMS_VERSION;
if (typeof(CORDOVA_PLATFORM) === "undefined") {
    var CORDOVA_PLATFORM = "cordova-1.8.1.js";
}

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
    if (typeof(DrGlearning) !== "undefined") {
        try {
            DrGlearning.app.getController("GlobalSettingsController").toHome();
        } catch (ex4) {
            console.log("Failed at showing Home screen");
        }
    }
}

try {
    (function () {
    // Exceptions Catcher Begins

        function load() {
            head.js(
                 (LANGS.indexOf(localStorage.locale) >= 0) ? "resources/js/locales/" + localStorage.locale + ".js" : "resources/js/locales/en.js",
                 "drglearningapp.js",
                 function () {
                    function onDeviceReady() {
                        // Now safe to use the PhoneGap API
                        console.log("LAUNCH!!!");
                        console.log("typeof(this.getController): " + typeof(this.getController));
                        console.log("DrGlearning: " + typeof(DrGlearning));
                    }
                    document.addEventListener("deviceready", onDeviceReady, false);
                }
            );
        }

        if ((typeof(Cordova) !== "undefined") && (typeof(PhoneGap) !== "undefined")) {
            head.js("resources/js/" + CORDOVA_PLATFORM, function () {
                load();
            });
        } else {
            load();
        }

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
