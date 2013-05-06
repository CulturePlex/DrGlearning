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
                    message: i18n.gettext('Loading activity') + "…",
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
                /*if (newActivity.data.image_url) {
                    //newActivity.getImage('image', 'image', this.activityView.down('[id=image]'), this, view, this.activityView, false);
                }
                else {*/
                this.loadingImages(view, this.activityView);
                //}
                this.showAnswers();
                if (typeof(MathJax) !== "undefined") {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                }
                
            },
            loadingComplete: function ()
            {
                this.activityView.show();
                this.view.add(this.activityView);
                Ext.Viewport.setMasked(false);
                if (!this.activity.data.helpviewed) {
                    this.activity.data.helpviewed = true;
                    this.activity.save();
                    this.levelController.helpAndQuery();
                }
                if (this.currentTime) {
                    this.showSeconds();
                }
                this.timeContainer = this.activityView.down('container[customId=timecontainer]');
                //this.timeLabel = this.activityView.down('label[customId=time]');
            },
            loadingImages: function (view, activityView)
            {
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
                clearInterval(this.secondtemp);
                var options = Ext.create('Ext.Container');
                options.config = {
                    layout: {
                        type: 'vbox',
                        pack: 'center',
                        align: 'middle'
                    },
                    style: 'opacity: 0.5;'
                };
                for (var i = 0; i < this.answers.length; i++) {
                    if (this.answers[i].trim() === this.activity.data.correct_answer)
                    {
                        this.activityView.down('container[customId=timecontainer]').add({
                            xtype: 'button',
                            text: this.answers[i].trim(),
                            margin: 3,
                            customId: 'respuestaQuiz',
                            answerNo: i + 1,
                            correctAnswer: true
                        });
                        this.correctAnswerId = i + 1;
                    } else
                    {
                        this.activityView.down('container[customId=timecontainer]').add({
                            xtype: 'button',
                            text: this.answers[i].trim(),
                            margin: 3,
                            customId: 'respuestaQuiz',
                            answerNo: i + 1
                        });
                    }
                }
                //this.timeLabel.setHtml("");
                this.activityView.add(options);
                
            },
            showSeconds: function ()
            {
                //this.timeLabel.setHtml(this.currentTime + "s");
                this.currentTime--;
            },
            tryIt: function (target)
            {
                this.puntos = 100;
                if (target.config.answerNo === this.correctAnswerId) 
                {
                    this.timeContainer.down('button[correctAnswer=true]').setUi('confirm');
                    Ext.Msg.alert(i18n.gettext('Right!'), this.activity.data.reward + '<br />' + i18n.gettext("Score") + ": " + this.puntos, function ()
                    {
                        this.daoController.activityPlayed(this.activity.data.id, true, this.puntos);
                    }, this);
                }
                else {
                    this.timeContainer.down('button[answerNo=' + target.config.answerNo + ']').setUi('decline');
                    Ext.Msg.alert(i18n.gettext('Wrong!'), this.activity.data.penalty, function ()
                    {
                        this.daoController.activityPlayed(this.activity.data.id, false, 0);
                    }, this);
                }
                
                
            },
            stop: function ()
            {
                clearInterval(this.secondtemp);
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
