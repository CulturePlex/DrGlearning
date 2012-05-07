//Global Words to skip JSLint validation//
/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/
/*global Ext i18n google GeoJSON activityView MathJax clearInterval event*/

Ext.define('DrGlearning.controller.activities.QuizController', {
    extend: 'Ext.app.Controller',
    requires: ['DrGlearning.store.Careers', 'DrGlearning.store.Levels', 'DrGlearning.view.CareersFrame'],
    views: ['ActivityFrame', 'activities.Geospatial'],
    controllers: ['DrGlearning.controller.Careers'],
    stores: ['Careers', 'Levels', 'Activities'],
    refs: [{
        ref: 'activities.geospatial',
        selector: 'mainview',
        autoCreate: true,
        xtype: 'mainview'
    }],
    activity: null,
    respuestas: null,
    currentTime: null,
    finishtemp: null,
    secondtemp: null,
	activityView: null,
	latexLoaded:false,
	imageLoaded:false,
	correctAnswerId:null,
    init: function () {
        "use strict";
		console.log("lokoooooooooooo");
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
        this.activity = newActivity;
        if (view.down('component[customId=activity]')) {
            view.down('component[customId=activity]').hide();
            view.down('component[customId=activity]').destroy();
        }
        this.activityView = Ext.create('DrGlearning.view.activities.Quiz');
		this.view = view;
        addQueryAndButtons(this.activityView, newActivity);
        this.respuestas = this.activity.data.answers;
        var time = newActivity.data.time;
        this.currentTime = time;
        if (newActivity.data.image_url) {
            newActivity.getImage('image', 'image', this.activityView.down('[id=image]'), this, view, this.activityView, false);
        }
        else {
            this.loadingImages(view, this.activityView);
        }
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
            levelController.helpAndQuery();
        }
        if (this.currentTime) {
            this.showSeconds();
        }
    },
	loadingImages: function (view, activityView)
	{
		this.imageLoaded=true;
		//if (this.latexLoaded) {
			this.loadingComplete();
		//}		
	},
	loadingLatex: function ()
	{
		this.latexLoaded=true;
		if(this.imageLoaded)
		{
			this.loadingComplete();
		}
	},
    showAnswers: function ()
    {
        clearInterval(this.finishtemp);
        clearInterval(this.secondtemp);
        
        var opciones = Ext.create('Ext.Container');
        opciones.config = {
            layout: {
                type: 'vbox',
                pack: 'center',
                align: 'middle'
            }
        };
        for (var i = 0; i < this.respuestas.length; i++) {
			if(this.respuestas[i] == this.activity.data.correct_answer)
			{
				this.correctAnswerId = i;
			}
            this.activityView.down('container[customId=time]').add({
                xtype: 'button',
                text: this.respuestas[i],
                margin: 3,
                customId: 'respuestaQuiz',
				answerNo:i
            });
        }
        this.activityView.down('label[customId=time]').setHtml("");
        this.activityView.add(opciones);
        
    },
    showSeconds: function ()
    {
        this.activityView.down('label[customId=time]').setHtml(this.currentTime + "s");
        this.currentTime--;
    },
    tryIt: function (target)
    {
        this.puntos = 100;
		console.log(target.config.answerNo);
		console.log(this.activity.data.correct_answer);
        if (target.config.answerNo === this.correctAnswerId) 
        {
            this.activityView.down('container[customId=time]').down('button[text=' + this.activity.data.correct_answer + ']').setUi('confirm');
            Ext.Msg.alert(i18n.gettext('Right!'), this.activity.data.reward + ' ' + i18n.gettext("obtained score:") + this.puntos, function ()
            {
                this.getApplication().getController('DaoController').activityPlayed(this.activity.data.id, true, this.puntos);
                this.levelController.nextActivity(this.activity.data.level_type);
            }, this);
        }
        else {
            this.activityView.down('container[customId=time]').down('button[text=' + target.config.text + ']').setUi('decline');
            Ext.Msg.alert(i18n.gettext('Wrong!'), this.activity.data.penalty , function ()
            {
                this.levelController.tolevel();
            }, this);
        }
        
        
    },
    stop: function ()
    {
        clearInterval(this.finishtemp);
        clearInterval(this.secondtemp);
    }
});
