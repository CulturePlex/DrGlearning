/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/

/*global
    Ext Jed catalogueEN catalogueES catalogueFR i18n google GeoJSON StackTrace Connection
*/


try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.controller.GlobalSettingsController', {
            extend: 'Ext.app.Controller',
            knowledgesList: {
                4:i18n.gettext('Literature'),
                5:i18n.gettext('History'),
                21:i18n.gettext('Geography'),
                28:i18n.gettext('Business and Marketing'),
                29:i18n.gettext('Humanities'),
                30:i18n.gettext('Performing Arts'),
                32:i18n.gettext('Religion and Theology'),
                33:i18n.gettext('Visual Arts'),
                47:i18n.gettext('Mathematics'),
                54:i18n.gettext('Education'),
                70:i18n.gettext('Space Sciences'),
            },
            init: function () {
            this.showLog=true;
            },
            onLaunch: function () {
            },
            getServerURL: function () {
                //return 'http://drglearning.testing.cultureplex.ca';
                return 'http://beta.drglearning.com';
                //return 'http://0.0.0.0:8000';
            },
            isDevice: function () {
                if (window.device === undefined) {
                    return false;
                } else {
                    return true;
                }
            },
            hasNetwork: function () {
                //console.log(this.isDevice());
                //console.log(navigator.network);
                if (!this.isDevice() || (navigator.network !== "undefined"  && navigator.network.connection.type !== Connection.NONE)) {
                    return true;
                } else {
                    return false;
                }
            },
            showMessage: function (message) {
                if (this.showLog)
                {
                    console.log(message);
                }
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
