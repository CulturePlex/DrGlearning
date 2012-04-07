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
		this.view=view;
        this.activity = newActivity;
        console.log(view.down('[customId=activity]'));
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
        console.log('olaaaaaaaaa');
        //activityView.down('container[id=image]').setHtml('<img alt="imagen" width="100%" src="'+newActivity.getImage('image','image',this)+'" />');
        this.activity.getImage('image', 'image', this.activityView.down('container[id=image]'), this, this.view, this.activityView, false);
        this.getApplication().getController('ActivityController').addQueryAndButtons(this.activityView, this.activity);
        this.respuestas = this.activity.data.answers;
        var time = this.activity.data.time;
        this.currentTime = time;
        //this.finishtemp=setTimeout(function(thisObj) { thisObj.showAnswers(); }, time*1000, this);
		this.activityView.down('container[customId=options]').removeAll();
		this.activityView.down('container[customId=options]').removeAll();
        this.activityView.down('label[customId=time]').setHtml(this.currentTime + "s");
        this.currentTime;
        this.secondtemp = setInterval(function(thisObj){
            thisObj.showSeconds();
        }, 1000, this);
    },
    
    loadingImages: function(view, activityView){
        activityView.show();
        view.add(activityView);
        Ext.Viewport.setMasked(false);
        if (!this.helpFlag) {
            this.getApplication().getController('LevelController').help();
            this.helpFlag = true;
        }
        this.showSeconds();
    },
    showAnswers: function(){
        activityView.down('label[customId=time]').setHtml("");
        //clearInterval(this.finishtemp);
        var obfuscatedImg = Ext.create('Ext.Container', {
            customId: 'obfuscated',
            layout: 'vbox',
            align: 'center',
            pack: 'center',
            padding: 10,
            html: '<img alt="imagen" width="100%" src="' + this.activity.data.obfuscated_image + '" />'
        
        });
        
        for (var i = 0; i < this.respuestas.length; i++) {
           activityView.down('container[customId=options]').add({
                xtype: 'button',
                text: this.respuestas[i],
                ui: 'round',
                padding: 5,
                customId: 'respuesta',
            });
        }
        activityView.down('container[id=image]').hide();
        //activityView.down('container[id=image]').destroy();
        activityView.add(obfuscatedImg);
        
    },
    tryIt: function(){
        this.puntos = 100;
        if (event.target.textContent == this.activity.data.correct_answer) {
            Ext.Msg.alert('Right!', this.activity.data.reward + ", obtained score:" + this.puntos, function(){
                this.getApplication().getController('DaoController').activityPlayed(this.activity.data.id, true, this.puntos);
                console.log('aski');
                this.getApplication().getController('LevelController').nextActivity(this.activity.data.level_type);
            }, this);
        }
        else {
            Ext.Msg.alert('Wrong!', 'Oooh, it isnt the correct answer', function(){
                this.getApplication().getController('LevelController').tolevel();
            }, this);
        }
        
        
    },
    showSeconds: function(){
    
        if (this.parado == false) {
            activityView.down('label[customId=time]').setHtml(this.currentTime + "s");
            this.currentTime--;
            console.log('holas');
            if (this.currentTime < 0) {
                clearInterval(this.secondtemp);
                this.showAnswers();
            }
        }
    },
    stop: function(){
        //clearInterval(this.finishtemp);
        console.log('hola');
        clearInterval(this.secondtemp);
        
    },
    stopNotClear: function(){
        this.parado = true;
    },
    restart: function(){
        this.parado = false;
    }
    
    
});
