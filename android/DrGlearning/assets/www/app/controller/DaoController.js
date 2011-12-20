
Ext.define('DrGlearning.controller.DaoController', {
    extend: 'Ext.app.Controller',
    stores: [
        'Careers','Activities','OfflineScores','Users'
    ],
	
	init: function(){
		
	},
	
	onLaunch: function() {
		
	},
	getInstalled: function() {
		return this.getCareersStore().findExact('installed','true');
	},
    installCareer: function(id,callback,scope) {
    	var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Downloading..."});
		myMask.show();
    	var career=this.getCareersStore().getById(id);
    	var activities=career.data.activities;
    	activities=activities.split(",");
    	//console.log("activity "+activities);
    	var activitiesInstalled=0;
		for (cont in activities){
			console.log(activities[cont]);
			Ext.data.JsonP.request({
				scope: this,
                url:'http://drglearning.testing.cultureplex.ca/'+activities[cont]+'?format=jsonp',
                params: {
                    deviceWidth: (window.screen.width != undefined) ? window.screen.width : 200,
                    deviceHeight: (window.screen.height != undefined) ? window.screen.height : 200
                },
                success:function(response, opts){
                	var activity=response;
                	var activityModel=new DrGlearning.model.Activity({
                		id : activity.id,
                		name : activity.name,
                		careerId : id,
                		activity_type : activity.activity_type,
                		language_code : activity.language_code,
                		level_type : activity.level_type,
                		level_order : activity.level_order,
                		level_required : activity.level_required,
                		query : activity.query,
                		timestamp : activity.timestamp,
                		resource_uri : activity.resource_uri,
                		reward: activity.reward,
                		score: 0,
                		played: false,
                		successful: false
                		
                	});
                	if(activityModel.data.activity_type=='linguistic'){
                		activityModel.data.image=activity.image;
                		activityModel.data.locked_text=activity.locked_text;
                		activityModel.data.answer=activity.answer;
                	}
                	if(activityModel.data.activity_type=='visual'){
                		activityModel.data.image=activity.image;
                		activityModel.data.answers=activity.answers;
                		activityModel.data.correct_answer=activity.correct_answer;
                		activityModel.data.obfuscated_image=activity.obfuscated_image;
                		activityModel.data.time=activity.time;
                	}
                	if(activityModel.data.activity_type=='relational'){
                		activityModel.data.graph_nodes=activity.graph_nodes;
                		activityModel.data.graph_edges=activity.graph_edges;
                    activityModel.data.constraints=activity.constraints;
                	}
                	if(activityModel.data.activity_type=='temporal'){
                		activityModel.data.image=activity.image;
                		activityModel.data.image_datetime=activity.image_datetime;
                		activityModel.data.query_datetime=activity.query_datetime;
                	}
                	if(activityModel.data.activity_type=='geospatial'){
                		activityModel.data.area=activity.area;
                		activityModel.data.point=activity.points;
                		activityModel.data.radius=activity.radius;
                	}
                	activityModel.save();
                	this.getActivitiesStore().sync();
					this.getActivitiesStore().load();
					activitiesInstalled=activitiesInstalled+1;
					if(activities.length==activitiesInstalled){
				    	myMask.hide();
				    	callback(scope);
		    		}
                }
            });
		}
		var career=this.getCareersStore().getById(id);
    	career.set('installed','true');
    	this.getCareersStore().load();
    	this.getCareersStore().sync();
    },
    
    /* 
     * Return the max level
     */
	getLevels: function(careerId){
		var levels=new Array();
		var activities=this.getActivitiesStore().queryBy(function(record) {
			return record.data.careerId==careerId;
		});
		activities.each(function(item) {
			var exist=false;
			for(x in levels){
				if(levels[x]==item.data.level_type){
					exist=true;
				}
			}
			if(!exist){
				levels.push(item.data.level_type);
			}
			//if(levels[item.data.level_type]==undefined){
			//	levels.push(item.data.level_type);
			//}
		});
		levels.sort(function(a, b) {
			return a - b;
		});
		return levels;
	},
	/*
	 * Returns a MixedCollection 
	 */
	getActivitiesByLevel: function(careerId,level){
		var activities=this.getActivitiesStore().queryBy(function(record) {
			return record.data.careerId==careerId && record.data.level_type==level;
		});
		return activities;
	},
	getknowledgesFields:function(){
		var knowledges=new Array();
		var career=this.getCareersStore();
		career.each(function(item) {
			//var temp=eval('('+item.data.knowledges+')');
			console.log(item.data.knowledges);
			var carrerKnowledges=item.data.knowledges;
			for(x in carrerKnowledges){
				var exist=false;
				for(y in knowledges){
					if(carrerKnowledges[x]==knowledges[y]){
						exist=true;
					}
				}
				if(!exist){
					knowledges.push(carrerKnowledges[x]);
				}
			}
		},this);
		return knowledges;
	},
	getCarresByKnowledge:function(Knowledge){
		var carrers=this.getCarrersStore().queryBy(function(record) {
			var knowledges=record.data.knowledges.split(",");
			for(x in knowledges){
				if(knowledges[x]==Knowledge){
					return true;
				}
			}
			return false;
		});
		return carrers;
	},
	activityPlayed:function(activityID,successful,score){
		var carrersStore=this.getCarrersStore();
		var activitiesStore=this.getActivitiesStore();
		var activity=activitiesStore.getById(activityID);
		if(successful){
			if(activity.data.successful){
				if(activity.data.score<parseInt(score)){
					activity.data.score=parseInt(score);
					this.updateScore(activityID,score);
				}
			}else{
				activity.data.score=parseInt(score);
			}
			activity.data.successful=true;
		}else{
			if(!activity.data.successful){
				if(activity.data.score<parseInt(score)){
					activity.data.score=parseInt(score);
				}
			}
		}
		activity.data.played=true;
		activity.save();
		activitiesStore.load();
		activitiesStore.sync();
		//Make carrer started if needed
		var carrer=carrersStore.getById(activity.data.careerId);
		if(!carrer.data.started){
			carrer.data.started=true;
			carrer.save();
			carrersStore.load();
			carrersStore.sync();
		}
	},
	updateScore:function(activityID,score){
		var offlineScoreStore=this.getOfflineScoresStore();
		var usersStore = this.getUsersStore();
		var user=usersStore.first();
		var HOST = "http://drglearning.testing.cultureplex.ca";
		if(navigator.network == undefined || navigator.network.connection.type!=Connection.NONE){
			Ext.data.JsonP.request({
				scope: this,
			    url: HOST+"/api/v1/highscore/?format=jsonp",
			    params: {
			    	player_code: user.data.uniqueid,
			    	activity_id: activityID,
			    	score: score
			    },
			    success: function(response){
			    	console.log("Score successfully updated");
				}
			});
			var offlineScoreOld=offlineScoreStore.queryBy(function(record) {
				if(record.data.activity_id==activityID){
					return true;
				}
			});
			offlineScoreOld.destroy();
			offlineScoreStore.sync();
			offlineScoreStore.load();
			updateOfflineScores();
		}else{
			var offlineScore=offlineScoreStore.queryBy(function(record) {
				if(record.data.activity_id==activityID){
					return true;
				}
			});
			var offlineScoreModel=new DrGlearning.model.OfflineScore({
				activity_id : activityID,
        		score : score
        	});
			if(offlineScore.getCount()!=0){
				offlineScoreModel.set('id',offlineScore.first().data.id);
			}
			offlineScoreModel.save();
			offlineScoreStore.sync();
			offlineScoreStore.load();
		}
	},
	/*
	 * Return level id
	 */
	getCurrenLevel:function(carrerID){
		console.log('la carrera es:'+carrerID);
		var levels=this.getLevels(carrerID);
		console.log('los niveles son:'+levels);
		for(var i=1;i<=levels.length;i++){
			var activities=this.getActivitiesByLevel(carrerID,levels[i]);
			for(var j=0;j<activities.items.length;j++){
				console.log(activities.items[j]);
				if(!activities.items[j].data.successful){
					console.log('devolviendo: '+levels[i]);
					return levels[i-1]; 
				}
			}
		}
		console.log('el primer nivelse suponeq es:'+levels[0]);
		return levels[0];
	},
	/*
	 * Return activity id
	 * 
	 */
	getCurrenActivity:function(carrerID,level){
		var activities=this.getActivitiesByLevel(carrerID,level);
		
		for(var j=0;j<activities.items.length;j++){
			console.log(activities.items[j]);
			if(!activities.items[j].data.successful){
				return activities.items[j].data.id; 
			}
		}
		return activities.items[0].data.id;
	},
	updateOfflineScores:function(){
		var offlineScoreStore=this.getOfflineScoresStore();
		var usersStore = this.getUsersStore();
		var user=usersStore.first();
		var HOST = 'http://drglearning.testing.cultureplex.ca';
		offlineScoreStore.each(function(item) {
			Ext.data.JsonP.request({
				scope: this,
			    url: HOST+'/api/v1/highscore/?format=jsonp',
			    params: {
			    	player_code: user.data.uniqueid,
			    	activity_id: item.data.activityID,
			    	score: item.data.score
			    },
			    success: function(response){
			    	console.log("Score successfully updated");
			    	item.destroy();
				}
			});
		},this);
		offlineScoreStore.sync();
		offlineScoreStore.load();	
	}

});