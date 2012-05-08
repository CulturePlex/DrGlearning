//Global Words to skip JSLint validation//
/*global Ext i18n google GeoJSON activityView*/

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
            message: i18n.gettext('Loading activity...'),
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
            Ext.Msg.alert(i18n.gettext('Success!'), this.activity.data.reward + ' ' + i18n.gettext("obtained score:") + this.score, function ()
            {
                this.daoController.activityPlayed(this.activity.data.id, true, this.score);
                this.levelController.nextActivity(this.activity.data.level_type);
            }, this);
        }
        else 
        {
            Ext.Msg.alert(i18n.gettext('Wrong!'), i18n.gettext('Oooh, it wasnt the correct answer'), function ()
            {
                this.levelController.tolevel();
            }, this);
        }
    },
    after: function ()
    {
        this.score = 100;
        if (this.activity.data.image_datetime > this.activity.data.query_datetime) {
            Ext.Msg.alert(i18n.gettext('Success!'), this.activity.data.reward + ' ' + i18n.gettext("obtained score:") + this.score, function ()
            {
                this.daoController.activityPlayed(this.activity.data.id, true, this.score);
                this.levelController.nextActivity(this.activity.data.level_type);
            }, this);
        }
        else {
            Ext.Msg.alert(i18n.gettext('Wrong!'), this.activity.data.penalty, function ()
            {
                this.levelController.tolevel();
            }, this);
        }
    }
});
