/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/

/*global
    Ext Jed catalogueEN catalogueES catalogueFR i18n google GeoJSON StackTrace DrGlearning
*/
try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.controller.ActivityController', {
            extend: 'Ext.app.Controller',
            activityView: null,
            /*
             * Initializate Controller.
             */
            init: function ()
            {
                this.levelController = this.getApplication().getController('LevelController');
            },
            addQueryAndButtons: function (activityView, newActivity)
            {
                //console.log(activityView);
                activityView.down('toolbar[customId=query]').add({
                    xtype: 'titlebar',
                    name: 'label_name',
                    customId: 'query_label',
                    id: 'label_id',
                    cls: 'query',
                    title: newActivity.data.query,
                    flex: 1,
                    ui: 'neutral',
                    style: 'font-size:13px'
                });
                var that = this;
                activityView.down('toolbar[customId=query]').down('titlebar').setListeners({
                    tap: {
                        fn: function ()
                        {
                            that.levelController.helpAndQuery();
                        },
                        element: 'element'
                    }
                });
                activityView.down('toolbar[customId=query]').add({
                    xtype: 'button',
                    text: '?',
                    ui: 'round',
                    id: 'help',
                    pack: 'middle'
                });
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
