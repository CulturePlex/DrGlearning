/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/

/*global
    Ext Jed catalogueEN catalogueES catalogueFR i18n google GeoJSON StackTrace Connection console
*/


try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.controller.GlobalSettingsController', {
            extend: 'Ext.app.Controller',
            knowledgesList: {
                4: i18n.gettext('Literature'),
                5: i18n.gettext('History'),
                13: i18n.gettext('Biology'),
                15: i18n.gettext('Film'),
                16: i18n.gettext('Media Studies'),
                17: i18n.gettext('Physics'),
                18: i18n.gettext('Chemistry'),
                21: i18n.gettext('Geography'),
                22: i18n.gettext('Music'),
                24: i18n.gettext('Popular Culture'),
                28: i18n.gettext('Business and Marketing'),
                29: i18n.gettext('Humanities'),
                30: i18n.gettext('Performing Arts'),
                31: i18n.gettext('Philosophy'),
                32: i18n.gettext('Religion and Theology'),
                33: i18n.gettext('Visual Arts'),
                34: i18n.gettext('Social Sciences'),
                35: i18n.gettext('Anthropology'),
                36: i18n.gettext('Archaeology'),
                37: i18n.gettext('Economics'),
                39: i18n.gettext('Political Science'),
                40: i18n.gettext('Psychology'),
                41: i18n.gettext('Sociology'),
                42: i18n.gettext('Natural Sciences'),
                45: i18n.gettext('Computer Science'),
                46: i18n.gettext('Logic'),
                47: i18n.gettext('Mathematics'),
                48: i18n.gettext('Statistics'),
                49: i18n.gettext('Systems Science'),
                51: i18n.gettext('Agriculture'),
                52: i18n.gettext('Architecture'),
                53: i18n.gettext('Design and Photography'),
                54: i18n.gettext('Education'),
                55: i18n.gettext('Engineering'),
                58: i18n.gettext('Health Science'),
                59: i18n.gettext('Journalism and Communication'),
                60: i18n.gettext('Law'),
                61: i18n.gettext('Library and Museum Studies'),
                63: i18n.gettext('Public Administration'),
                64: i18n.gettext('Social Work'),
                65: i18n.gettext('Linguistics'),
                66: i18n.gettext('Earth Sciences'),
                67: i18n.gettext('Environmental Studies and Forestry'),
                68: i18n.gettext('Life Sciences'),
                69: i18n.gettext('Military Sciences'),
                70: i18n.gettext('Space Sciences'),
                71: i18n.gettext('Sports and Recreation')
            },
            learnParent: null,
            init: function () {
                this.showLog = true;
                this.visualController = this.getApplication().getController('activities.VisualController');
                this.careerController = this.getApplication().getController('CareerController');
                this.levelController = this.getApplication().getController('LevelController');
                this.careersListController = this.getApplication().getController('CareersListController');
            },
            onLaunch: function () {
            },
            toHome: function () {
                Ext.Viewport.setMasked(false);
                var view = this.levelController.getActivityframe();
                if (typeof(view) !== 'undefined') {
                    view.hide();
                }
                this.visualController.stop();
            
                var view1 = this.levelController.getLevelframe();
                if (typeof(view1) !== 'undefined')
                {
                    view1.hide();
                }
                
                localStorage.selectedcareer = 0;
                
                var view2 = this.careerController.careerFrame;
                if (typeof(view1) !== 'undefined')
                {
                    view2.hide();
                }
                this.careersListController.index();
            },
            getServerURL: function () {
                //return 'http://drglearning.testing.cultureplex.ca';
                return 'http://beta.drglearning.com';
                //return 'http://127.0.0.1:9000';
            },
            isDevice: function () {
                if (window.device === undefined) {
                    return false;
                } else {
                    return true;
                }
            },
            hasNetwork: function () {
                /*console.log('el device');
                console.log(this.isDevice());
                console.log('navigator');
                console.log(navigator);
                console.log('navigator.network');
                console.log(navigator.network);
                console.log('navigator.network.connection');
                console.log(navigator.network.connection);
                console.log('navigator.network.connection.type');
                console.log(navigator.network.connection.type);*/
                if (!this.isDevice() || (navigator.network !== "undefined"  && navigator.network.connection.type !== Connection.NONE)) {
                    return true;
                } else {
                    return false;
                }
            },
            showMessage: function (message) {
                if (this.showLog)
                {
 //                   console.log(message);
                }
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
