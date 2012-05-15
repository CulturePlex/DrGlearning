//Global Words to skip JSLint validation//
/*global Ext i18n google GeoJSON activityView event clearInterval setInterval DrGlearning*/

Ext.define('DrGlearning.controller.activities.VisualController', {
    extend: 'Ext.app.Controller',
    view: null,
    activity: null,
    activityView: null,
    answers: null,
    finishtemp: null,
    secondtemp: null,
    currentTime: 0,
    score: null,
    isStopped: false,
    loading: null,
    init: function ()
    {
        this.isStopped = false;
        this.levelController = this.getApplication().getController('LevelController');
        this.activityController = this.getApplication().getController('ActivityController');
        this.daoController = this.getApplication().getController('DaoController');
        this.control({
            'button[customId=respuesta]': {
                tap: this.tryIt
            },
            'button[customId=skip]': {
                tap: this.skip
            }
        });
    },
    updateActivity: function (view, newActivity) 
    {
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Loading activity...',
            indicator: true
            //html: "<img src='resources/images/activity_icons/visual.png'>",
        });
        this.loading = true;
        this.view = view;
        this.activity = newActivity;
        view.down('[customId=activity]').destroy();
        var activityView = Ext.create('DrGlearning.view.activities.Visual', 
        {
            listeners: {
                painted: function ()
                {
                    DrGlearning.app.getApplication().getController('activities.VisualController').startGame();
                }
            }
        });
        this.activityView = activityView;
        view.add(activityView);
        activityView.show();
        
    },
    /**We wait for the painted event of the view to start the game...
     *
     */
    startGame: function ()
    {
        this.imageContainer = this.activityView.down('container[id=image]');
        this.optionsContainer = this.activityView.down('container[customId=options]');
        this.timeLabel = this.activityView.down('label[customId=time]');
        this.obImageContainer = this.activityView.down('container[id=obImage]');

        this.imageContainer.setHtml('');
        this.activity.getImage('image', 'image', this.imageContainer, this, this.view, this.activityView, false);
        this.activityController.addQueryAndButtons(this.activityView, this.activity);
        this.answers = this.activity.data.answers;
        var time = this.activity.data.time;
        this.currentTime = time;
        this.optionsContainer.removeAll();
        this.optionsContainer.removeAll();
        
        this.timeLabel.setHtml(this.currentTime + i18n.gettext(" sec."));
        var that = this;
        this.secondtemp = setInterval(function () 
        {
            that.showSeconds();
        }, 1000);
        this.imageContainer.show();
        this.obImageContainer.hide();
        this.optionsContainer.hide();
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
        this.loading = false;
    },
    showAnswers: function () 
    {
        this.timeLabel.setHtml('');
        this.activityView.down('button[customId=skip]').hide();
        this.obImageContainer.setHtml('<img class="activityImage" width="100%" alt="imagen" src="' + this.activity.data.obfuscated_image + '" />');
        for (var i = 0; i < this.answers.length; i++) {
            this.optionsContainer.add({
                xtype: 'button',
                text: this.answers[i],
                margin: 3,
                customId: 'respuesta'
            });
        }
        //var newImg = new Image();
        //newImg.src = this.activity.getImageSrc
        //var widthTemp=var newImg = new Image();
        this.imageContainer.hide();
        this.optionsContainer.show();
        this.obImageContainer.show();
    },
    tryIt: function ()
    {
    
        this.score = 100;
        if (event.target.textContent === this.activity.data.correct_answer) 
        {
            Ext.Msg.alert(i18n.gettext('Right!'), this.activity.data.reward + ' ' + i18n.gettext("obtained score:") + this.score, function ()
            {
                this.optionsContainer.down('button[text=' + this.activity.data.correct_answer + ']').setUi('confirm');
                this.daoController.activityPlayed(this.activity.data.id, true, this.score);
                this.levelController.nextActivity(this.activity.data.level_type);
            }, this);
        }
        else {
            this.optionsContainer.down('button[text=' + event.target.textContent + ']').setUi('decline');
            Ext.Msg.alert(i18n.gettext('Wrong!'), this.activity.data.penalty, function ()
            {
                this.levelController.tolevel();
            }, this);
        }
    },
    showSeconds: function ()
    {
     
        if (this.isStopped === false && this.loading === false) 
        {
            this.currentTime--;
            this.timeLabel.setHtml(this.currentTime + i18n.gettext(" sec."));
            if (this.currentTime < 0) {
                clearInterval(this.secondtemp);
                this.showAnswers();
            }
        }
    },
    skip: function ()
    {
        clearInterval(this.secondtemp);
        this.showAnswers();
    },
    stop: function ()
    {
        clearInterval(this.secondtemp);
    },
    stopNotClear: function ()
    {
        this.isStopped = true;
    },
    restart: function ()
    {
        this.isStopped = false;
    }
});
