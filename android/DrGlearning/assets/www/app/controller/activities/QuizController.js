//Global Words to skip JSLint validation//
/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/
/*global Ext i18n google GeoJSON activityView MathJax clearInterval event*/

Ext.define('DrGlearning.controller.activities.QuizController', {
    extend: 'Ext.app.Controller',

    view: null,
    activity: null,
    activityView: null,

    timeContainer: null,
    timeLabel: null,

    answers: null,
    currentTime: null,
    secondtemp: null,
    latexLoaded: false,
    imageLoaded: false,
    correctAnswerId: null,
    imageUrl: null,

    init: function () {
        "use strict";
        this.activityController = this.getApplication().getController('ActivityController');
        this.levelController = this.getApplication().getController('LevelController');
        this.daoController = this.getApplication().getController('DaoController');
        this.control({
            'button[customId=respuestaQuiz]': {
                tap: this.tryIt
            }
        });
    },
    updateActivity: function (view, newActivity) {
        "use strict";
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: i18n.gettext('Loading activity...'),
            indicator: true
            //html: "<img src='resources/images/activity_icons/quiz.png'>",
        });

        view.down('component[customId=activity]').destroy();

        this.view = view;
        this.activity = newActivity;
        this.activityView = Ext.create('DrGlearning.view.activities.Quiz');
        this.answers = this.activity.data.answers;
        this.currentTime = newActivity.data.time;
        this.activityController.addQueryAndButtons(this.activityView, newActivity);
        this.timeContainer = this.activityView.down('panel[customId=time]');
        //this.imageUrl = this.activity.getImage('image', 'image', this.activityView.down('[id=image]'), this, undefined, this.activityView, false);
        /*if (newActivity.data.image_url) {
            newActivity.getImage('image', 'image', this.activityView.down('[id=image]'), this, view, this.activityView, false);
            this.loadingImages(view, this.activityView);
        }
        else {
            this.loadingImages(view, this.activityView);
        }*/
        this.showAnswers();
        if (typeof(MathJax) !== "undefined") {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        }
        newActivity.getImage('image', 'image', null, this, view, this.activityView, true);
    },
    loadingComplete: function ()
    {
        this.activityView.show();
        this.view.add(this.activityView);
        console.log(this.imageUrl);
        this.timeContainer.setHtml(this.imageUrl);
        this.timeContainer.setStyle({backgroundImage: 'url('+this.imageUrl+')'});
        Ext.Viewport.setMasked(false);
        if (!this.activity.data.helpviewed) {
            this.activity.data.helpviewed = true;
            this.activity.save();
            this.levelController.helpAndQuery();
        }
        if (this.currentTime) {
            this.showSeconds();
        }
        
    },
    loadingImages: function (view, activityView,value)
    {
        this.imageUrl = value;
        this.imageLoaded = true;
        //if (this.latexLoaded) {
        this.loadingComplete();
        //}        
    },
    loadingLatex: function ()
    {
        this.latexLoaded = true;
        if (this.imageLoaded)
        {
            this.loadingComplete();
        }
    },
    showAnswers: function ()
    {
        this.timeContainer.add({xtype:'spacer'});
        for (var i = 0; i < this.answers.length; i++) {
            if (this.answers[i].trim() === this.activity.data.correct_answer)
            {
                this.timeContainer.add({
                    xtype: 'button',
                    text: this.answers[i].trim(),
                    margin: 3,
                    customId: 'respuestaQuiz',
                    answerNo: i+1,
                    correctAnswer: true,
                    style: 'opacity: 0.8;'
                    
                });
                this.correctAnswerId = i+1;
            }else
            {
                console.log(this.answers[i].trim());
                console.log(i);
                this.timeContainer.add({
                    xtype: 'button',
                    text: this.answers[i].trim(),
                    margin: 3,
                    customId: 'respuestaQuiz',
                    answerNo: i+1,
                    style: 'opacity: 0.8;'
                });
            }
        }
    },
    tryIt: function (target)
    {
        this.puntos = 100;
        if (target.config.answerNo === this.correctAnswerId) 
        {
            this.timeContainer.down('button[correctAnswer=true]').setUi('confirm');
            Ext.Msg.alert(i18n.gettext('Right!'), this.activity.data.reward + ' ' + i18n.gettext("obtained score:") + this.puntos, function ()
            {
                this.daoController.activityPlayed(this.activity.data.id, true, this.puntos);
                this.levelController.nextActivity(this.activity.data.level_type);
            }, this);
        }
        else {
        console.log(target.config.answerNo);
            this.timeContainer.down('button[answerNo=' + target.config.answerNo + ']').setUi('decline');
            Ext.Msg.alert(i18n.gettext('Wrong!'), this.activity.data.penalty, function ()
            {
                this.levelController.tolevel();
            }, this);
        }
        
        
    },
});
