Ext.define('DrGlearning.controller.activities.LinguisticController', {
    extend:  'Ext.app.Controller',
	config: {
		fullscreen:true,
        refs: {
            linguistic: 'activities.linguistic',
            activityframe: 'activityframe',
        }
    },
	activity:null,
	respuestas:null,
	squaresBlack:null,
	loquedText:null,
	loquedTextFinded:null,
	puntos:null,
	init: function(){
		this.levelController = this.getApplication().getController('LevelController');
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
	updateActivity: function(view,newActivity) {
		console.log(view);
		this.activity= newActivity;
		view.down('component[customId=activity]').destroy();
		activityView = Ext.create('DrGlearning.view.activities.Linguistic');
		//Initializate values
		this.squaresBlack=[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
		this.loquedText=this.activity.data.locked_text.split("");
		this.loquedTextFinded=new Array();
		var cont;
		for(cont in this.loquedText){
			this.loquedTextFinded[cont]=false;
		}
		//activityView.down('panel[customId=image]').setHtml('<img alt="imagen" height="100px" src="'+newActivity.data.image+'" />');
		var table=this.getTable();
		activityView.down('panel[customId=image]').setHtml(table);
		activityView.down('toolbar[customId=query]').setHtml(this.getApplication().getController('LevelController').getHelpHtml()+"<div class='querymia'><p>"+newActivity.data.query + "</p></div>");
		activityView.down('label[customId=loqued]').setHtml(newActivity.data.locked_text.replace(/[A-z0-9]/g,'_'));
		activityView.down('label[customId=responses]').setHtml('');
		this.respuestas=this.activity.data.answers;
		console.log(this.activity);
		activityView.show();
		view.add(activityView);
		
		
	},
	tryIt: function() {
		var letterView=activityView.down('textfield[customId=letter]');
		var responseView=activityView.down('label[customId=responses]');
		var loquedView=activityView.down('label[customId=loqued]');
		var letter=letterView.getValue();
		letterView.setValue('');
		var cont;
		var exist=false;
		for(cont in this.loquedTextFinded){
			if(letter.toLowerCase()==this.loquedText[cont].toLowerCase()){
				this.loquedTextFinded[cont]=true;
				exist=true;
			}
		}
		if(exist){
			responseView.setHtml(responseView.getHtml()+letter+' ');
			this.goodLetter();
		}else{
			responseView.setHtml(responseView.getHtml()+letter.fontcolor("red")+' ');
		}
		var loqued="";
		for(cont in this.loquedTextFinded){
			if(this.loquedTextFinded[cont]){
				loqued=loqued+this.loquedText[cont];
			}else{
				loqued=loqued+"_";
			}
		}
		loquedView.setHtml(loqued);
	},
	
	getTable:function(){
		var table='<table style="background-repeat:no-repeat;background-position:center center;" border="1" WIDTH="100%" HEIGHT="170" BACKGROUND="'+newActivity.getImage('image','image')+'"><tr>';
		//var table='<table border="1" WIDTH="100%" HEIGHT="170" BACKGROUND="WHITE"><tr>';
		var squaresBlack=this.squaresBlack;
		var cont;
		var temp;
		//console.log('Probando getTable');
		//console.log(squares.length);
		for(cont in squaresBlack){
			if(squaresBlack[cont]){
				table=table+'<td BGCOLOR="BLACK"></td>';	
			}else{
				table=table+'<td></td>';
			}
			if(((parseInt(cont)+1)%5)==0){
				table=table+'</tr>';
				//console.log('cierra con el '+cont);
			}
			if(((parseInt(cont)+1)%5)==0 && (parseInt(cont)+1)!=25){
				table=table+'<tr>';
				//console.log('abre con el '+cont);
			}
		}
		table=table+'</tr></table>';
		return table;
	},
	
	goodLetter:function(){
		var cont;
		var goodLetters=0;
		var whiteSquares=0;
		for(cont in this.loquedTextFinded){
			if(this.loquedTextFinded[cont]){
				goodLetters++;
			}
		}
		var keysBlack=new Array();
		for(cont in this.squaresBlack){
			if(!this.squaresBlack[cont]){
				whiteSquares++;
			}else{
				keysBlack.push(cont);
			}
		}
		var neededWhiteSquares=Math.floor((goodLetters*25)/this.loquedTextFinded.length);
		//console.log('goodLetters='+goodLetters);
		//console.log('whiteSquares='+whiteSquares);
		//console.log('neededWhiteSquares='+neededWhiteSquares);
		while(goodLetters> 0 && whiteSquares<neededWhiteSquares){
			var random=Math.floor(Math.random()*keysBlack.length);
			this.squaresBlack[keysBlack[random]]=false;
			keysBlack=new Array();
			for(cont in this.squaresBlack){
				if(this.squaresBlack[cont]){
					keysBlack.push(cont);
				}
			}
			whiteSquares++;
		}
		activityView.down('panel[customId=image]').setHtml(this.getTable());
		
	},
		
	solve: function() { 
		this.puntos=100;
		console.log(this.activity.data.answer);
		var answer;
		var saveButton = Ext.create('Ext.Button', {
			scope : this,
			text : 'Solve',
		});
		var cancelButton = Ext.create('Ext.Button', {
			scope : this,
			text : 'Cancel',
		});
		var show = new Ext.MessageBox().show({
			id : 'info',
			title : 'Answer the question:',
			msg : this.activity.data.query,
			items : [ {
				xtype : 'textfield',
				labelAlign : 'top',
				clearIcon : true,
				value : '',
				id : 'importvalue',
			} ],
			buttons : [ cancelButton, saveButton ],
			icon : Ext.Msg.INFO,
		});
		saveButton.setHandler(function() {
			show.hide();
			answer = show.down('#importvalue').getValue();
			if (answer.toLowerCase() == this.activity.data.answer.toLowerCase()) 
			{
				Ext.Msg.alert('Right!', this.activity.data.reward+"obtained score:"+this.puntos, function(){
					this.getApplication().getController('DaoController').activityPlayed(this.activity.data.id,true,this.puntos);
					this.getApplication().getController('LevelController').nextActivity(this.activity.data.level_type);
				}, this);
			}else{
				Ext.Msg.alert('Wrong!', 'Oooh, it isnt the correct answer', function(){
					this.getApplication().getController('LevelController').tolevel();
				}, this);
			}
		});
		cancelButton.setHandler(function() {
			show.hide();
			this.destroy(show);
		});
	},
});
