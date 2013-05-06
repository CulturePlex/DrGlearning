/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/

/*global
    Ext Jed catalogueEN catalogueES catalogueFR i18n google GeoJSON StackTrace MathJax
*/
try {
    (function () {
    // Exceptions Catcher Begins
        Ext.define('DrGlearning.controller.activities.TemporalController', {
            extend: 'Ext.app.Controller',
            activity: null,
            score: null,
            init: function ()
            {
                this.levelController = this.getApplication().getController('LevelController');
                this.activityController = this.getApplication().getController('ActivityController');
                this.daoController = this.getApplication().getController('DaoController');
                this.control({
                    'button[customId=after]': {
                        tap: this.after
                    },
                    'button[customId=before]': {
                        tap: this.before
                    }
                });
            },
            updateActivity: function (view, newActivity)
            {
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: i18n.gettext('Loading activity') + "…",
                    indicator: true
                    //html: "<img src='resources/images/activity_icons/temporal.png'>",
                });
                this.activity = newActivity;
                if (view.down('component[customId=activity]')) {
                    view.down('component[customId=activity]').hide();
                    view.down('component[customId=activity]').destroy();
                }
                var activityView = Ext.create('DrGlearning.view.activities.Temporal');
                this.activityController.addQueryAndButtons(activityView, newActivity);
                newActivity.getImage('image', 'image', activityView.down('[id=image]'), this, view, activityView, false);
            },
            loadingImages: function (view, activityView)
            {
                activityView.show();
                view.add(activityView);
                Ext.Viewport.setMasked(false);
                if (!this.activity.data.help) {
                    this.activity.data.help = true;
                    this.activity.save();
                    this.levelController.helpAndQuery();
                }
            },
            before: function ()
            {
                this.score = 100;
                if (this.activity.data.image_datetime < this.activity.data.query_datetime) {
                    Ext.Msg.alert(i18n.gettext('Right!'), this.activity.data.reward + '<br />' + i18n.gettext("Score") + ": " + this.score, function ()
                    {
                        this.daoController.activityPlayed(this.activity.data.id, true, this.score);
                    }, this);
                }
                else 
                {
                    Ext.Msg.alert(i18n.gettext('Wrong!'), i18n.gettext("Oh, oh. That isn't the right answer"), function ()
                    {
                        this.daoController.activityPlayed(this.activity.data.id, false, 0);
                    }, this);
                }
            },
            after: function ()
            {

                if (this.activity.data.image_datetime > this.activity.data.query_datetime) {
                    this.score = 100;
                    Ext.Msg.alert(i18n.gettext('Right!'), this.activity.data.reward + '<br />' + i18n.gettext("Score") + ": " + this.score, function ()
                    {
                        this.daoController.activityPlayed(this.activity.data.id, true, this.score);
                    }, this);
                }
                else {
                    this.score = 0;
                    Ext.Msg.alert(i18n.gettext('Wrong!'), this.activity.data.penalty, function ()
                    {
                        this.daoController.activityPlayed(this.activity.data.id, false, 0);
                    }, this);
                }
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
