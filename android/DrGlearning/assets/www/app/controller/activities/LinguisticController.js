/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/

/*global
    Ext Jed catalogueEN catalogueES catalogueFR i18n google GeoJSON StackTrace
*/

try {
    (function () {
    // Exceptions Catcher Begins
        Ext.define('DrGlearning.controller.activities.LinguisticController', {
            extend: 'Ext.app.Controller',
            config: {
                fullscreen: true,
                refs: {
                    linguistic: 'activities.linguistic',
                    activityframe: 'activityframe'
                }
            },
            activity: null,
            activityView: null,
            respuestas: null,
            squaresBlack: null,
            loquedText: null,
            loquedTextFinded: null,
            score: null,
            imagesrc: null,
            init: function () {
                this.activityController = this.getApplication().getController('ActivityController');
                this.levelController = this.getApplication().getController('LevelController');
                this.daoController = this.getApplication().getController('DaoController');
                this.control({
                    'button[customId=solve]': {
                        tap: this.solve
                    }
                });
                this.control({
                    'button[customId=try]': {
                        tap: this.tryIt
                    }
                });
                
            },
            updateActivity: function (view, newActivity)
            {
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: i18n.gettext('Loading activity') + "…",
                    indicator: true
                    //html: "<img src='resources/images/activity_icons/linguistic.png'>",
                });
                this.score = 100;
                this.activity = newActivity;
                view.down('component[customId=activity]').destroy();
                this.activityView = Ext.create('DrGlearning.view.activities.Linguistic');
                //Initializate values
                this.squaresBlack = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
                this.loquedText = this.activity.data.locked_text.split("");
                this.loquedTextFinded = [];
                var cont;
                for (cont in this.loquedText) 
                {
                    if (this.loquedText[cont] === " ") {
                        this.loquedTextFinded[cont] = true;
                    }
                    else {
                        this.loquedTextFinded[cont] = false;
                    }
                    
                }
                this.activityController.addQueryAndButtons(this.activityView, newActivity);
                this.activityView.down('label[customId=loqued]').setHtml(newActivity.data.locked_text.replace(/[A-z0-9]/g, '_ '));
                this.activityView.down('label[customId=responses]').setHtml('');
                if (this.activity.data.locked_text.toLowerCase() === this.activity.data.answer.toLowerCase()) {
                    this.activityView.down('label[customId=tip]').setHtml(i18n.gettext('Answer') + ": ");
                }
                this.activityView.down('label[customId=responses]').setHtml('');
                this.respuestas = this.activity.data.answers;
                newActivity.getImage('image', 'image', null, this, view, this.activityView, true);
            },
            loadingImages: function (view, activityView, value)
            {
                this.imagesrc = value;
                var table = this.getTable();
                activityView.down('panel[customId=image]').setHtml(table);
                this.goodLetter();
                activityView.show();
                view.add(activityView);
                Ext.Viewport.setMasked(false);
                if (!this.activity.data.helpviewed) {
                    this.activity.data.helpviewed = true;
                    this.activity.save();
                    this.levelController.helpAndQuery();
                }
            },
            tryIt: function ()
            {
                var letterView = this.activityView.down('textfield[customId=letter]');
                var responseView = this.activityView.down('label[customId=responses]');
                var loquedView = this.activityView.down('label[customId=loqued]');
                var letter = letterView.getValue();
                letterView.setValue('');
                var cont;
                var exist = false;
                for (cont in this.loquedTextFinded) {
                    if (letter.toLowerCase() === this.loquedText[cont].toLowerCase()) {
                        this.loquedTextFinded[cont] = true;
                        exist = true;
                    }
                }
                if (exist) {
                    this.score -= 5;
                    responseView.setHtml(responseView.getHtml() + letter + ' ');
                    this.goodLetter();
                }
                else {
                    this.score -= 10;
                    responseView.setHtml(responseView.getHtml() + letter.fontcolor("red") + ' ');
                }
                var loqued = "";
                for (cont in this.loquedTextFinded) {
                    if (this.loquedTextFinded[cont]) {
                        loqued = loqued + this.loquedText[cont];
                    }
                    else {
                        loqued = loqued + "_ ";
                    }
                }
                loquedView.setHtml(loqued);
                if (loqued.toLowerCase() === this.activity.data.answer.toLowerCase()) 
                {
                    Ext.Msg.alert(i18n.gettext('Right!'), this.activity.data.reward + ' ' + i18n.gettext("Score") + ": " + this.score, function ()
                    {
                        this.daoController.activityPlayed(this.activity.data.id, true, this.score);
                        this.levelController.nextActivity(this.activity.data.level_type);
                    }, this);
                }
            },
            
            getTable: function ()
            {
                var table = '<table style="background-repeat:no-repeat;background-position:center center;" WIDTH="100%" HEIGHT="170" BACKGROUND="' + this.imagesrc + '"><tr>';
                //var table='<table border="1" WIDTH="100%" HEIGHT="170" BACKGROUND="WHITE"><tr>';
                var squaresBlack = this.squaresBlack;
                var cont;
                var temp;
                for (cont = 0; cont < squaresBlack.length; cont++)
                {
                    if (squaresBlack[cont]) {
                        table = table + '<td BGCOLOR="BLACK" style="border: inset 0pt" width="20%"></td>';
                    }
                    else {
                        table = table + '<td></td>';
                    }
                    if (((parseInt(cont, 10) + 1) % 5) === 0) {
                        table = table + '</tr>';
                    }
                    if (((parseInt(cont, 10) + 1) % 5) === 0 && (parseInt(cont, 10) + 1) !== 25) 
                    {
                        table = table + '<tr>';
                    }
                }
                table = table + '</tr></table>';
                return table;
            },
            
            goodLetter: function ()
            {
                var cont;
                var goodLetters = 1;
                var whiteSquares = 0;
                for (cont in this.loquedTextFinded) {
                    if (this.loquedTextFinded[cont]) {
                        goodLetters++;
                    }
                }
                var keysBlack = [];
                for (cont in this.squaresBlack) {
                    if (!this.squaresBlack[cont]) {
                        whiteSquares++;
                    }
                    else {
                        keysBlack.push(cont);
                    }
                }
                var neededWhiteSquares = Math.floor((goodLetters * 25) / this.loquedTextFinded.length);
                while (goodLetters > 0 && whiteSquares < neededWhiteSquares) {
                    var random = Math.floor(Math.random() * keysBlack.length);
                    this.squaresBlack[keysBlack[random]] = false;
                    keysBlack = [];
                    for (cont in this.squaresBlack) {
                        if (this.squaresBlack[cont]) {
                            keysBlack.push(cont);
                        }
                    }
                    whiteSquares++;
                }
                this.activityView.down('panel[customId=image]').setHtml(this.getTable());
                
            },
            
            solve: function ()
            {
                var answer;
                var saveButton = Ext.create('Ext.Button', {
                    scope: this,
                    text: i18n.gettext('Solve')
                });
                var cancelButton = Ext.create('Ext.Button', {
                    scope: this,
                    text: i18n.gettext('Cancel')
                });
                var show = new Ext.MessageBox().show({
                    id: 'info',
                    title: i18n.gettext('Answer the question') + ": ",
                    msg: this.activity.data.query,
                    items: [{
                        xtype: 'textfield',
                        labelAlign: 'top',
                        clearIcon: true,
                        value: '',
                        id: 'importvalue'
                    }],
                    buttons: [cancelButton, saveButton],
                    icon: Ext.Msg.INFO
                });
                saveButton.setHandler(function ()
                {
                    show.hide();
                    answer = show.down('#importvalue').getValue();
                    if (answer.toLowerCase() === this.activity.data.answer.toLowerCase()) {
                        if (this.score < 50)
                        {
                            this.score = 50;
                        }
                        Ext.Msg.alert(i18n.gettext('Right!'), this.activity.data.reward + ' ' + i18n.gettext("Score") + ": " + this.score, function ()
                        {
                            this.daoController.activityPlayed(this.activity.data.id, true, this.score);
                            this.levelController.nextActivity(this.activity.data.level_type);
                        }, this);
                    }
                    else {
                        if (this.score < 0)
                        {
                            this.score = 0;
                        }
                        Ext.Msg.alert(i18n.gettext('Wrong!'), this.activity.data.penalty, function ()
                        {
                            this.daoController.activityPlayed(this.activity.data.id, false, this.score);
                            this.levelController.tolevel();
                        }, this);
                    }
                });
                cancelButton.setHandler(function ()
                {
                    show.hide();
                    this.destroy(show);
                });
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
