Ext.define('DrGlearning.controller.activities.VisualController', {
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
	view:null,
    activity: null,
    activityView: null,
    respuestas: null,
    finishtemp: null,
    secondtemp: null,
    currentTime: 0,
    puntos: null,
    parado: false,
	loading: null,
    init: function(){
        this.parado = false;
        this.levelController = this.getApplication().getController('LevelController');
        this.control({
            'button[customId=respuesta]': {
                tap: this.tryIt
            }
        });
    },
    updateActivity: function(view, newActivity){
		
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Loading activity...',
            indicator: true,
            //html: "<img src='resources/images/activity_icons/visual.png'>",
        });
		this.loading=true;
		this.view=view;
        this.activity = newActivity;
        view.down('[customId=activity]').hide();
        view.down('[customId=activity]').destroy();
        
        activityView = Ext.create('DrGlearning.view.activities.Visual', {
            listeners: {
                painted: function(){
                    console.log('show');
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
    startGame: function(){
		this.activityView.down('container[id=image]').setHtml('');
        this.activity.getImage('image', 'image', this.activityView.down('container[id=image]'), this, this.view, this.activityView, false);
        this.getApplication().getController('ActivityController').addQueryAndButtons(this.activityView, this.activity);
        this.respuestas = this.activity.data.answers;
        var time = this.activity.data.time;
        this.currentTime = time;
		this.activityView.down('container[customId=options]').removeAll();
		this.activityView.down('container[customId=options]').removeAll();
		
        this.activityView.down('label[customId=time]').setHtml(this.currentTime + "s");
		var that= this;		
        this.secondtemp = setInterval(function(){
            that.showSeconds();
        }, 1000);
		this.activityView.down('container[id=image]').show();
		this.activityView.down('container[id=obImage]').hide();
    },
    
    loadingImages: function(view, activityView){
        activityView.show();
        view.add(activityView);
        Ext.Viewport.setMasked(false);
        if (!this.helpFlag) {
            this.getApplication().getController('LevelController').helpAndQuery();
            this.helpFlag = true;
        }
        this.loading=false;
    },
    showAnswers: function(){
        activityView.down('label[customId=time]').setHtml('');
		this.activityView.down('container[id=obImage]').setHtml('<img class="activityImage" alt="imagen" src="' + this.activity.data.obfuscated_image + '" />');
        for (var i = 0; i < this.respuestas.length; i++) {
           activityView.down('container[customId=options]').add({
                xtype: 'button',
                text: this.respuestas[i],
                ui: 'small',
				margin: 3,
                customId: 'respuesta',
            });
        }
        activityView.down('container[id=image]').hide();
		activityView.down('container[id=obImage]').show();
    },
    tryIt: function(){
		
        this.puntos = 100;
        if (event.target.textContent == this.activity.data.correct_answer) {
            Ext.Msg.alert(i18n.gettext('Right!'), this.activity.data.reward + i18n.gettext(" obtained score:") + this.puntos, function(){
				activityView.down('container[customId=options]').down('button[text='+this.activity.data.correct_answer+']').setUi('confirm-small');
                this.getApplication().getController('DaoController').activityPlayed(this.activity.data.id, true, this.puntos);
                this.getApplication().getController('LevelController').nextActivity(this.activity.data.level_type);
            }, this);
        }
        else {
			activityView.down('container[customId=options]').down('button[text='+event.target.textContent+']').setUi('decline-small');
            Ext.Msg.alert(i18n.gettext('Wrong!'), i18n.gettext('Oooh, it isnt the correct answer'), function(){
                this.getApplication().getController('LevelController').tolevel();
            }, this);
        }
    },
    showSeconds: function(){
    
        if (this.parado == false && this.loading == false) {
			this.currentTime--;
            activityView.down('label[customId=time]').setHtml(this.currentTime + "s");
            if (this.currentTime < 0) {
                clearInterval(this.secondtemp);
                this.showAnswers();
            }
        }
    },
    stop: function(){
        clearInterval(this.secondtemp);
    },
    stopNotClear: function(){
        this.parado = true;
    },
    restart: function(){
        this.parado = false;
    }
});