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
    init: function () {
        "use strict";
        this.levelController = this.getApplication().getController('LevelController');
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
        this.getApplication().getController('ActivityController').addQueryAndButtons(this.activityView, newActivity);
        this.respuestas = this.activity.data.answers;
        var opciones = 6;
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
            this.getApplication().getController('LevelController').helpAndQuery();
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
            this.activityView.down('container[customId=time]').add({
                xtype: 'button',
                text: this.respuestas[i],
                margin: 3,
                customId: 'respuestaQuiz'
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
    tryIt: function ()
    {
    
    
        this.puntos = 100;
        if (event.target.textContent === this.activity.data.correct_answer) 
        {
            this.activityView.down('container[customId=time]').down('button[text=' + this.activity.data.correct_answer + ']').setUi('confirm');
            Ext.Msg.alert(i18n.gettext('Right!'), this.activity.data.reward + ' ' + i18n.gettext("obtained score:") + this.puntos, function ()
            {
                this.getApplication().getController('DaoController').activityPlayed(this.activity.data.id, true, this.puntos);
                this.getApplication().getController('LevelController').nextActivity(this.activity.data.level_type);
            }, this);
        }
        else {
            this.activityView.down('container[customId=time]').down('button[text=' + event.target.textContent + ']').setUi('decline');
            Ext.Msg.alert(i18n.gettext('Wrong!'), this.activity.data.penalty , function ()
            {
                this.getApplication().getController('LevelController').tolevel();
            }, this);
        }
        
        
    },
    stop: function ()
    {
        clearInterval(this.finishtemp);
        clearInterval(this.secondtemp);
    }
});
